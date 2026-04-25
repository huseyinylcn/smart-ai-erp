import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, ChevronRight, Plus, Clock, Info, 
  RefreshCw, CheckCircle2, Save, Loader2, Trash2
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';

interface CalendarDay {
  id: string;
  date: string;
  isWorkDay: boolean;
  description: string | null;
  type: 'WORK' | 'HOLIDAY' | 'SHORT_DAY' | 'EXTRA_WORK_DAY';
}

const parseTimeRobust = (s: string) => {
  if (!s) return 0;
  let timeStr = s.toUpperCase().trim();
  const isPM = timeStr.includes('PM');
  const isAM = timeStr.includes('AM');
  timeStr = timeStr.replace('AM', '').replace('PM', '').trim();
  
  const parts = timeStr.split(':');
  let h = parseInt(parts[0], 10) || 0;
  let m = parseInt(parts[1], 10) || 0;
  
  if (isPM && h < 12) h += 12;
  if (isAM && h === 12) h = 0;
  return h * 60 + m;
};

const ProductionCalendar = () => {
  const { activeCompany } = useCompany();
  const { formatNumber } = useFormat();
  const companyId = activeCompany?.id || '';
  const [calendar, setCalendar] = useState<CalendarDay[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [selectedShiftId, setSelectedShiftId] = useState<string>('');
  const [changedDays, setChangedDays] = useState<Record<string, CalendarDay>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(new Date().getMonth()); // Default to current month
  const [isInitializing, setIsInitializing] = useState(false);
  const [monthStatus, setMonthStatus] = useState<string>('DRAFT');

  const fetchShifts = async () => {
    if (!companyId) return;
    try {
      const data = await hrApi.getShifts(companyId);
      setShifts(data);
      if (data.length > 0 && !selectedShiftId) {
        setSelectedShiftId(data[0].id);
      }
    } catch (error) {
      console.error('FETCH_SHIFTS_ERROR:', error);
    }
  };

  const fetchCalendar = async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const shiftParam = selectedShiftId || undefined;
      const data = await hrApi.getCalendar(year, companyId, shiftParam);
      setCalendar(data);
    } catch (error) {
      console.error('FETCH_CALENDAR_ERROR:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, [companyId]);

  const fetchMonthStatus = async () => {
    if (!companyId || selectedMonth === null) return;
    try {
      const data = await hrApi.getMonthStatus(year, selectedMonth, companyId, selectedShiftId);
      setMonthStatus(data.status);
    } catch (error) {
      console.error('FETCH_MONTH_STATUS_ERROR:', error);
    }
  };

  useEffect(() => {
    fetchCalendar();
    fetchMonthStatus();
  }, [year, companyId, selectedShiftId, selectedMonth]);

  const toggleDayStatus = (day: CalendarDay) => {
    if (monthStatus === 'APPROVED') return;
    
    const nextStatusMap: Record<string, { type: 'WORK' | 'HOLIDAY' | 'SHORT_DAY', isWorkDay: boolean }> = {
      'WORK': { type: 'HOLIDAY', isWorkDay: false },
      'HOLIDAY': { type: 'SHORT_DAY', isWorkDay: true },
      'SHORT_DAY': { type: 'WORK', isWorkDay: true }
    };

    const next = nextStatusMap[day.type] || nextStatusMap['WORK'];
    const updatedDay: CalendarDay = {
       ...day,
       type: next.type,
       isWorkDay: next.isWorkDay,
       description: next.type === 'HOLIDAY' ? 'İstirahət Günü' : (next.type === 'SHORT_DAY' ? 'Qısa İş Günü' : null)
    };
    
    // Update local state for immediate feedback
    setCalendar((prev: CalendarDay[]) => prev.map(d => d.id === day.id ? updatedDay : d));
    setChangedDays((prev: Record<string, CalendarDay>) => ({ ...prev, [day.id]: updatedDay }));
  };

  const handleSaveCalendar = async () => {
    const daysToUpdate = Object.values(changedDays);
    if (daysToUpdate.length === 0) return;

    try {
      setIsInitializing(true);
      await hrApi.updateCalendarBatch(daysToUpdate, companyId);
      setChangedDays({});
      alert("Dəyişikliklər uğurla yadda saxlanıldı.");
      await fetchCalendar();
    } catch (error: any) {
      alert("Xəta baş verdi: " + error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleCancelChanges = () => {
    if (window.confirm("Bütün dəyişikliklərdən imtina edilsin?")) {
      setChangedDays({});
      fetchCalendar();
    }
  };

  const handleInitYear = async (targetYear: number) => {
    if (!companyId) {
       alert("Zəhmət olmasa əvvəlcə şirkət seçin.");
       return;
    }

    // Check if month/shift is approved
    if (monthStatus === 'APPROVED' && selectedMonth !== null) {
      alert("Təsdiqlənmiş ay üzrə təqvim yenidən yaradıla bilməz. Əvvəlcə təsdiqi ləğv edin.");
      return;
    }
    const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
    const label = selectedMonth !== null ? `${monthNames[selectedMonth]} ayı` : `${targetYear}-ci il`;
    
    if (!window.confirm(`${label} üçün təqvim yaradılsın? Mövcud məlumatlar sıfırlanacaq.`)) return;
    
    try {
      setIsInitializing(true);
      console.log('[CALENDAR_INIT] Initializing...', { targetYear, companyId, selectedShiftId, selectedMonth });
      const shiftParam = selectedShiftId || null;
      await hrApi.initCalendar(targetYear, companyId, shiftParam, selectedMonth);
      console.log('[CALENDAR_INIT] Success, fetching updated calendar...');
      await fetchCalendar();
      alert(`${label} üçün təqvim uğurla yaradıldı.`);
    } catch (error: any) {
      console.error('[CALENDAR_INIT_ERROR]', error);
      alert("Xəta baş verdi: " + error.message);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleClearMonth = async () => {
     if (monthStatus === 'APPROVED') {
        alert("Təsdiqlənmiş ay təmizlənə bilməz. Əvvəlcə təsdiqi ləğv edin.");
        return;
     }
     const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
     const label = selectedMonth !== null ? `${monthNames[selectedMonth]} ayı` : `${year}-ci il`;
     
     if (!window.confirm(`${label} üçün təqvim təmizlənsin? Bütün gündəlik məlumatlar silinəcək.`)) return;
     
     try {
        setIsInitializing(true);
        await hrApi.clearCalendar(year, companyId, selectedMonth !== null ? selectedMonth : undefined);
        await fetchCalendar();
        alert(`${label} üçün təqvim təmizləndi.`);
     } catch (e: any) {
        alert("Xəta: " + e.message);
     } finally {
        setIsInitializing(false);
     }
  };

  const handleSyncHolidays = async () => {
    setIsInitializing(true);
    try {
      let holidays: any[] = [];
      
      if (year === 2024) {
        // Official 2024 Calendar from sosial.gov.az
        holidays = [
          { date: "2024-01-01", description: "Yeni il bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-01-02", description: "Yeni il bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-01-03", description: "İstirahət günü (Köçürülmüş)", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-01-04", description: "İstirahət günü (Köçürülmüş)", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-01-05", description: "İstirahət günü (Köçürülmüş)", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-01-07", description: "İş günü (7 yanvar sərəncamı)", type: "WORK", isWorkDay: true },
          { date: "2024-01-19", description: "Ümumxalq hüzn günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-01-20", description: "Ümumxalq hüzn günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-02-06", description: "Seçki günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-02-07", description: "Növbədənkənar AR Prezidenti seçkiləri", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-03-07", description: "Qadınlar günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-03-08", description: "Qadınlar günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-03-19", description: "Novruz bayramı qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-03-20", description: "Novruz bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-03-21", description: "Novruz bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-03-22", description: "Novruz bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-03-23", description: "Novruz bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-03-24", description: "Novruz bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-03-25", description: "İstirahət günü (Köçürülmüş)", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-03-26", description: "İstirahət günü (Köçürülmüş)", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-04-09", description: "Ramazan bayramı qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-04-10", description: "Ramazan bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-04-11", description: "Ramazan bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-05-08", description: "Qələbə günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-05-09", description: "Faşizm üzərində qələbə günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-05-27", description: "Müstəqillik günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-05-28", description: "Müstəqillik günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-06-14", description: "Qurtuluş günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-06-15", description: "Azərbaycan xalqının milli qurtuluş günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-06-16", description: "Qurban bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-06-17", description: "Qurban bayramı", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-06-18", description: "İstirahət günü (Köçürülmüş)", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-06-19", description: "İstirahət günü (Köçürülmüş)", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-06-25", description: "Silahlı Qüvvələr günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-06-26", description: "AR Silahlı Qüvvələri günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-11-07", description: "Zəfər günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-11-08", description: "Zəfər Günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-11-09", description: "AR Dövlət bayrağı günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-11-11", description: "İstirahət günü (Köçürülmüş)", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-12-23", description: "Bələdiyyə seçkiləri günü", type: "HOLIDAY", isWorkDay: false },
          { date: "2024-12-30", description: "Həmrəylik günü qabağı", type: "SHORT_DAY", isWorkDay: true },
          { date: "2024-12-31", description: "Dünya azərbaycanlılarının həmrəyliyi günü", type: "HOLIDAY", isWorkDay: false }
        ];
      } else {
        // Generic logic for other years
        const baseHolidays = [
          { date: `${year}-01-01`, description: "Yeni İl" },
          { date: `${year}-01-02`, description: "Yeni İl" },
          { date: `${year}-01-20`, description: "Ümumxalq Hüzn Günü" },
          { date: `${year}-03-08`, description: "Qadınlar Günü" },
          { date: `${year}-03-20`, description: "Novruz Bayramı" },
          { date: `${year}-03-21`, description: "Novruz Bayramı" },
          { date: `${year}-03-22`, description: "Novruz Bayramı" },
          { date: `${year}-03-23`, description: "Novruz Bayramı" },
          { date: `${year}-03-24`, description: "Novruz Bayramı" },
          { date: `${year}-05-09`, description: "Qələbə Günü" },
          { date: `${year}-05-28`, description: "Müstəqillik Günü" },
          { date: `${year}-06-15`, description: "Milli Qurtuluş Günü" },
          { date: `${year}-06-26`, description: "Silahlı Qüvvələr Günü" },
          { date: `${year}-11-08`, description: "Zəfər Günü" },
          { date: `${year}-11-09`, description: "Dövlət Bayrağı Günü" },
          { date: `${year}-12-31`, description: "Həmrəylik Günü" }
        ];

        holidays = [...baseHolidays];
        baseHolidays.forEach(h => {
          const d = new Date(h.date);
          const day = d.getDay();
          if (day === 0) { // Sun
            const nextMon = new Date(d); nextMon.setDate(d.getDate() + 1);
            holidays.push({ date: nextMon.toISOString().split('T')[0], description: `${h.description} (Köçürülmüş)` });
          } else if (day === 6) { // Sat
            const nextMon = new Date(d); nextMon.setDate(d.getDate() + 2);
            holidays.push({ date: nextMon.toISOString().split('T')[0], description: `${h.description} (Köçürülmüş)` });
          }
        });
      }

      const shiftParam = selectedShiftId || undefined;
      await hrApi.syncCalendar(year, holidays, companyId, shiftParam);
      await fetchCalendar();
    } catch (error) {
      console.error('SYNC_HOLIDAYS_ERROR:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const calendarStats = useMemo(() => {
    const stats = { workDays: 0, holidays: 0, hours: 0, weeklyNorm: 40.0 };
    const currentShift = shifts.find(s => s.id === selectedShiftId);
    
    if (!currentShift) return stats;

    const parseTime = parseTimeRobust;

    const dailySettingsRaw = currentShift.dailySettings || {};
    const dailySettings = typeof dailySettingsRaw === 'string' ? JSON.parse(dailySettingsRaw) : dailySettingsRaw;
    
    const defaultStart = parseTime(currentShift.startTime || '09:00');
    const defaultEnd = parseTime(currentShift.endTime || '18:00');
    const lunchMin = Number(currentShift.lunchDurationMin || 0);

    calendar.forEach(d => {
      const dt = new Date(d.date);
      const dYear = dt.getFullYear();
      const dMonth = dt.getMonth();
      
      if (year !== null && dYear !== year) return;
      if (selectedMonth !== null && dMonth !== selectedMonth) return;
        
        if (d.isWorkDay) {
          stats.workDays++;
          
          const dayIdx = dt.getDay(); // 0-Sun ... 6-Sat
          const setting = dailySettings[dayIdx.toString()];
          let start = defaultStart;
          let end = defaultEnd;
          let dayLunchMin = lunchMin;

          if (setting) {
            if (setting.start) start = parseTimeRobust(setting.start);
            if (setting.end) end = parseTimeRobust(setting.end);
            if (setting.lunchStart && setting.lunchEnd) {
              dayLunchMin = parseTimeRobust(setting.lunchEnd) - parseTimeRobust(setting.lunchStart);
            }
          }

          let dayHours = (end - start - dayLunchMin) / 60;
          if (dayHours < 0) dayHours = 0;
          
          if (d.type === 'SHORT_DAY') {
            dayHours = Math.max(0, dayHours - 1);
          }
          
          stats.hours += dayHours;
        } else {
          stats.holidays++;
        }
    });

    stats.hours = Math.round(stats.hours * 10) / 10;
    
    // Calculate dynamic weekly norm from shift settings
    let weeklyNorm = 0;
    if (currentShift) {
        const daysToCalc = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun
        daysToCalc.forEach(dIdx => {
           if (currentShift.workDays?.includes(dIdx)) {
              const setting = dailySettings[dIdx.toString()];
              let start = defaultStart;
              let end = defaultEnd;
              let dayLunchMin = lunchMin;
              if (setting) {
                  if (setting.start) start = parseTimeRobust(setting.start);
                  if (setting.end) end = parseTimeRobust(setting.end);
                  if (setting.lunchStart && setting.lunchEnd) {
                      dayLunchMin = parseTimeRobust(setting.lunchEnd) - parseTimeRobust(setting.lunchStart);
                  }
              }
              weeklyNorm += (end - start - dayLunchMin) / 60;
           }
        });
    } else {
        weeklyNorm = 40.0;
    }

    return { ...stats, weeklyNorm: Math.round(weeklyNorm * 10) / 10 };
  }, [calendar, selectedMonth, year, shifts, selectedShiftId]);

  const MonthGrid = ({ monthIndex }: { monthIndex: number }) => {
    const monthNames = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
    const weekDays = ["BE", "ÇA", "ÇƏ", "CA", "CÜ", "ŞƏ", "BA"];
    
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = (new Date(year, monthIndex, 1).getDay() + 6) % 7; // Monday = 0
    
    const monthData = useMemo(() => {
      return calendar.filter(d => {
        const dt = new Date(d.date);
        return dt.getFullYear() === year && dt.getMonth() === monthIndex;
      });
    }, [calendar, year, monthIndex]);

    const currentShift = shifts.find(s => s.id === selectedShiftId);
    const isFiveDay = currentShift ? currentShift.workDays?.length === 5 : true;

    const stats = useMemo(() => {
      const currentShift = shifts.find(s => s.id === selectedShiftId);
      
      const dailySettingsRaw = currentShift?.dailySettings || {};
      const dailySettings = typeof dailySettingsRaw === 'string' ? JSON.parse(dailySettingsRaw) : dailySettingsRaw;

      const defaultStart = parseTimeRobust(currentShift?.startTime || '09:00');
      const defaultEnd = parseTimeRobust(currentShift?.endTime || '18:00');
      const lunchMin = Number(currentShift?.lunchDurationMin || 0);

      let total = 0;
      let fullDays = 0;
      let shortDays = 0;
      
      monthData.forEach(d => {
        if (d.isWorkDay) {
          const dt = new Date(d.date);
          const dayIdx = dt.getDay(); 
          const setting = dailySettings[dayIdx.toString()];
          let start = defaultStart;
          let end = defaultEnd;
          let dayLunchMin = lunchMin;

          if (setting) {
            if (setting.start) start = parseTimeRobust(setting.start);
            if (setting.end) end = parseTimeRobust(setting.end);
            if (setting.lunchStart && setting.lunchEnd) {
              dayLunchMin = parseTimeRobust(setting.lunchEnd) - parseTimeRobust(setting.lunchStart);
            }
          }

          let dayHours = (end - start - dayLunchMin) / 60;
          if (dayHours < 0) dayHours = 0;
          
          if (d.type === 'SHORT_DAY') {
            dayHours = Math.max(0, dayHours - 1);
            shortDays++;
          } else {
            fullDays++;
          }
          
          total += dayHours;
        }
      });
      
      return { fullDays, shortDays, total: Math.round(total * 10) / 10 };
    }, [monthData, shifts, selectedShiftId]);

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-visible">
        <h3 className="text-sm font-black uppercase italic tracking-widest mb-6 text-slate-800 dark:text-white border-b border-slate-50 dark:border-slate-800 pb-4 group-hover:text-indigo-600 transition-colors">{monthNames[monthIndex]}</h3>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(d => <div key={d} className="text-[8px] font-black text-slate-300 text-center mb-2">{d}</div>)}
          
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            // Robust matching: compare YYYY, MM, DD components
            const dayInfo = monthData.find(d => {
              const dt = new Date(d.date);
              return dt.getDate() === day; 
            });
            
            const dt = new Date(year, monthIndex, day);
            const dayOfWeek = dt.getDay(); // 0-Sun, 6-Sat
            const isLocked = monthStatus === 'APPROVED';
            const isWeekend = dayOfWeek === 0 || (dayOfWeek === 6 && isFiveDay);
            
            let bgClass = "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-50 dark:border-slate-700 shadow-sm";
            let tooltip = dayInfo?.description || (isWeekend ? "İstirahət Günü" : "");

            if (dayInfo) {
              if (dayInfo.type === 'HOLIDAY') {
                if (isWeekend && !dayInfo.description?.includes('Bayram') && !dayInfo.description?.includes('Hüzn')) {
                  // Standard Weekend Rest
                  bgClass = "bg-emerald-700 text-white shadow-md shadow-emerald-100 font-bold border-none";
                  tooltip = "İstirahət Günü";
                } else {
                  // Named Holiday or Manual Holiday
                  bgClass = "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/20";
                }
              } else if (dayInfo.type === 'SHORT_DAY') {
                bgClass = "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/20";
              } else if (!dayInfo.isWorkDay) {
                // Any other non-work day defaults to green if weekend
                if (isWeekend) bgClass = "bg-emerald-700 text-white shadow-md shadow-emerald-100 font-bold border-none";
                else bgClass = "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/20";
              }
            } else if (isWeekend) {
              // Fallback if no data yet
              bgClass = "bg-emerald-700 text-white shadow-md shadow-emerald-100 font-bold border-none";
            }

            return (
              <button 
                key={day}
                onClick={() => dayInfo && !isLocked && toggleDayStatus(dayInfo)}
                className={`w-full aspect-square rounded-xl flex items-center justify-center text-[11px] font-black italic transition-all ${!isLocked ? 'hover:scale-110 active:scale-95 cursor-pointer' : 'cursor-not-allowed opacity-80'} ${bgClass}`}
                title={tooltip}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex flex-col items-center">
           <div className="flex flex-col items-center gap-1 mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Aylıq iş vaxtı norması:</span>
              <span className="text-[18px] font-black text-slate-800 dark:text-white tabular-nums italic">
                {stats.total.toFixed(1)}
              </span>
           </div>
           <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-900/10 px-8 py-3 rounded-full shadow-sm">
              <Clock className="w-5 h-5 text-indigo-500" />
              <span className="text-[14px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest italic">
                {stats.total} SAAT
              </span>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-10 animate-in fade-in duration-700 pb-32">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-3">
             <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] italic border border-indigo-500/10 shadow-sm">REPUBLIC OF AZERBAIJAN</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">İstehsalat Təqvimi ({year})</h1>
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-4 italic opacity-80">RƏSMİ İŞ QRAFİKİ VƏ İŞ SAATI NORMALARININ İDARƏ EDİLMƏSİ</p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
           {/* SHIFT SELECTOR */}
           <div className="flex items-center bg-white dark:bg-slate-900 px-6 py-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg group">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mr-4">İş Rejimi:</span>
              <select 
                value={selectedShiftId}
                onChange={(e) => setSelectedShiftId(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-widest italic text-slate-700 dark:text-white outline-none cursor-pointer min-w-[150px]"
              >
                {shifts.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
           </div>

           {/* YEAR & MONTH SELECTOR */}
           <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg items-center">
              <div className="flex items-center border-r border-slate-50 dark:border-slate-800 pr-2">
                  <button onClick={() => setYear(prev => prev - 1)} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
                  <span className="px-6 font-black text-xs uppercase tracking-widest italic text-indigo-600 w-[100px] text-center">{year} İL</span>
                  <button onClick={() => setYear(prev => prev + 1)} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="flex items-center pl-4 pr-4">
                  <select 
                    value={selectedMonth === null ? 'all' : selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value === 'all' ? null : parseInt(e.target.value))}
                    className="bg-transparent text-xs font-black uppercase tracking-widest italic text-slate-700 dark:text-white outline-none cursor-pointer min-w-[120px] text-center"
                  >
                    <option value="all">Bütün İl</option>
                    {["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"].map((m, idx) => (
                        <option key={idx} value={idx}>{m}</option>
                    ))}
                  </select>
              </div>
           </div>

               <div className="flex flex-wrap items-center gap-3">
                 {/* 1. TƏSDİQLƏ (APPROVE) */}
                 {selectedMonth !== null && monthStatus !== 'APPROVED' && (
                   <button 
                     onClick={async () => {
                       if (!window.confirm("Bu ay üzrə təqvimi rəsmi olaraq təsdiqləmək istədiyinizə əminsiniz?")) return;
                       try {
                          setIsInitializing(true);
                          await hrApi.approveMonth(year, selectedMonth, 'APPROVED', companyId, selectedShiftId);
                          setMonthStatus('APPROVED');
                       } catch (e: any) {
                          alert(e.message);
                       } finally {
                          setIsInitializing(false);
                       }
                     }}
                     className="px-8 py-5 bg-indigo-600 border border-indigo-500 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
                   >
                     <CheckCircle2 className="w-3.5 h-3.5" /> Təsdiqlə
                   </button>
                 )}

                 {/* 2. YADDA SAXLA (SAVE CHANGES) */}
                 {selectedMonth !== null && monthStatus !== 'APPROVED' && (
                   <button 
                     onClick={handleSaveCalendar}
                     disabled={isInitializing || Object.keys(changedDays).length === 0}
                     className={`px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg ${
                       Object.keys(changedDays).length > 0 
                       ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100 animate-pulse' 
                       : 'bg-white border border-slate-100 text-slate-300 cursor-not-allowed opacity-50'
                     }`}
                   >
                     <Save className="w-4 h-4" /> Yadda Saxla
                   </button>
                 )}

                 {/* 3. LOCK / UNLOCK */}
                 {selectedMonth !== null && (
                   <button 
                     onClick={async () => {
                       const newStatus = monthStatus === 'APPROVED' ? 'DRAFT' : 'APPROVED';
                       if (!window.confirm(`${newStatus === 'APPROVED' ? 'Təsdiq (LOCK)' : 'Təsdiqi ləğv (UNLOCK)'} edilsin?`)) return;
                       try {
                          setIsInitializing(true);
                          await hrApi.approveMonth(year, selectedMonth, newStatus, companyId, selectedShiftId);
                          setMonthStatus(newStatus);
                       } catch (e: any) {
                          alert(e.message);
                       } finally {
                          setIsInitializing(false);
                       }
                     }}
                     className={`px-8 py-5 border rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2 ${
                       monthStatus === 'APPROVED' 
                         ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                         : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                     }`}
                     title={monthStatus === 'APPROVED' ? 'Açmaq (Unlock)' : 'Kilidləmək (Lock)'}
                   >
                     {monthStatus === 'APPROVED' ?  <><RefreshCw className="w-3 h-3"/> Unlock</> : <><Info className="w-3 h-3"/> Lock</>}
                   </button>
                 )}

                 {/* 4. TƏMİZLƏ (CLEAR) */}
                 {selectedMonth !== null && monthStatus !== 'APPROVED' && (
                   <button 
                    onClick={handleClearMonth}
                    className="px-8 py-5 bg-white border border-slate-200 text-slate-400 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all flex items-center gap-2"
                   >
                     <Trash2 className="w-3 h-3" /> Təmizlə
                   </button>
                 )}

                 {/* 5. TƏQVİM YARAT (CREATE) */}
                 {monthStatus !== 'APPROVED' && (
                   <button 
                     onClick={() => handleInitYear(year)}
                     disabled={isInitializing}
                     className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                   >
                     <Plus className="w-4 h-4" /> Təqvim Yarat
                   </button>
                 )}
               </div>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-indigo-600 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
               <h4 className="text-[10px] font-black uppercase tracking-widest italic opacity-60 mb-4">Ümumi İş Norması</h4>
               <div className="flex items-end justify-between leading-none">
                  <p className="text-4xl font-black italic tracking-tighter tabular-nums">{formatNumber(calendarStats.hours, 1)} <span className="text-xs opacity-50 uppercase tracking-widest ml-2">SAAT</span></p>
                  <Clock className="w-10 h-10 opacity-20" />
               </div>
          </div>
          <div className="bg-emerald-500 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-emerald-500/20">
               <h4 className="text-[10px] font-black uppercase tracking-widest italic opacity-60 mb-4">İş Günləri</h4>
               <div className="flex items-end justify-between leading-none">
                  <p className="text-4xl font-black italic tracking-tighter tabular-nums">{formatNumber(calendarStats.workDays, 0)} <span className="text-xs opacity-50 uppercase tracking-widest ml-2">GÜN</span></p>
                  <CheckCircle2 className="w-10 h-10 opacity-20" />
               </div>
          </div>
          <div className="bg-rose-500 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-rose-500/20">
               <h4 className="text-[10px] font-black uppercase tracking-widest italic opacity-60 mb-4">Qeyri-İş Günləri</h4>
               <div className="flex items-end justify-between leading-none">
                  <p className="text-4xl font-black italic tracking-tighter tabular-nums">{formatNumber(calendarStats.holidays, 0)} <span className="text-xs opacity-50 uppercase tracking-widest ml-2">GÜN</span></p>
                  <CalendarIcon className="w-10 h-10 opacity-20" />
               </div>
          </div>
          <div className="bg-amber-500 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-amber-500/20">
              <h4 className="text-[10px] font-black uppercase tracking-widest italic opacity-60 mb-4">Həftəlik Norma</h4>
              <div className="flex items-end justify-between leading-none">
                 <p className="text-4xl font-black italic tracking-tighter tabular-nums">{formatNumber(calendarStats.weeklyNorm, 1)} <span className="text-xs opacity-50 uppercase tracking-widest ml-2">SAAT</span></p>
                 <Info className="w-10 h-10 opacity-20" />
              </div>
          </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="relative">
          {isLoading || isInitializing ? (
              <div className="absolute inset-0 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm rounded-[4rem] flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <Loader2 className="w-16 h-16 text-indigo-600 animate-spin opacity-20" />
                    <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin absolute inset-0 m-auto" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 italic animate-pulse">Verilənlər emal edilir...</p>
              </div>
          ) : null}

          {calendar.length === 0 || (selectedMonth !== null && !calendar.some(d => new Date(d.date).getMonth() === selectedMonth)) ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 p-20 text-center">
               <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6">
                  <CalendarIcon className="w-8 h-8 text-slate-300" />
               </div>
               <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2 italic">
                 {selectedMonth !== null 
                   ? `${["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"][selectedMonth]} ayı üzrə təqvim hələ yaradılmayıb`
                   : `${year}-cü il üzrə təqvim hələ yaradılmayıb`
                 }
               </h3>
               <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-10 italic">Sistemdə bu dövrə dair heç bir məlumat tapılmadı</p>
               
               <button 
                 onClick={() => handleInitYear(year)}
                 className="px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl italic"
               >
                  {selectedMonth !== null ? "Ayı İnisializasiya Edin" : "İli İnisializasiya Edin"}
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {Array.from({ length: 12 })
                  .map((_, i) => i)
                  .filter(m => selectedMonth === null || m === selectedMonth)
                  .map((m) => <MonthGrid key={m} monthIndex={m} />)}
            </div>
          )}
      </div>

      {/* FOOTER ACTIONS */}
      {calendar.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10 leading-none">
            <div className="flex items-center space-x-6 italic uppercase leading-none">
               <div className="p-5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-[1.5rem] leading-none"><Info className="w-8 h-8" /></div>
               <div className="leading-none">
                  <h4 className="text-base font-black text-slate-800 dark:text-white mb-3">İnteraktiv İdarəetmə Görünüşü</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">Təqvim xanalarına klikləməklə statusları (İş günü / Bayram / Saat) tək-tək dəyişə bilərsiniz. <br/>Dəyişikliklər birbaşa sistemə qeyd olunur.</p>
               </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-6 mr-10">
                    <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-white border border-slate-200"></span><span className="text-[9px] font-black text-slate-400 uppercase italic">İş Günü</span></div>
                    <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span><span className="text-[9px] font-black text-slate-400 uppercase italic">Bayram</span></div>
                    <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span><span className="text-[9px] font-black text-slate-400 uppercase italic">Qısa Gün</span></div>
                </div>
                <button 
                  onClick={handleSyncHolidays}
                  disabled={isInitializing || monthStatus === 'APPROVED'}
                  className={`px-12 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/10 italic flex items-center space-x-3 ${monthStatus === 'APPROVED' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Bayramları Avtomatik Sinxronizasiya Et</span>
                </button>
            </div>
        </div>
      )}

    </div>
  );
};

export default ProductionCalendar;
