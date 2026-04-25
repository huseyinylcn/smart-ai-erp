import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  Calendar, Users, Clock, ChevronLeft, ChevronRight, 
  Printer, Info, AlertTriangle, RotateCcw, PlayCircle, Loader2,
  Lock, Unlock, Save, Zap, ShieldCheck
} from 'lucide-react';
import { hrApi } from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import { useFormat } from '../../context/FormatContext';
import { financeApi } from '../../utils/api';
import { useOutletContext } from 'react-router-dom';

interface Employee {
  id: string;
  fullName: string;
  code: string;
  fin: string;
  pos: string;
  dept: string;
  workplaceType: string;
  startDate: string; // YYYY-MM-DD
  status: string;
  deletedAt: string | null;
  workShiftId: string | null;
}

interface DayStatus {
  id?: string;
  status: string;
  hours?: number;
}

interface AttendanceData {
  [empId: string]: {
    [day: number]: DayStatus;
  };
}

// Status Codes - Standard Azerbaijani HR Abbreviations
// Status Codes - Updated to match newest business rules
const STATUSES: Record<string, { code: string, label: string, color: string, bg: string, description?: string }> = {
  WORK: { code: 'İŞ', label: 'İş Günü', color: 'bg-emerald-500', bg: 'bg-emerald-50', description: 'Standard iş günü' },
  AO: { code: 'AO', label: 'Ayın ortası işə qəbul', color: 'bg-teal-500', bg: 'bg-teal-50' },
  X: { code: 'X', label: 'Əmək müqaviləsinə xitam', color: 'bg-rose-700', bg: 'bg-rose-50' },
  M1: { code: 'M1', label: 'Ödənişli əsas məzuniyyət', color: 'bg-blue-600', bg: 'bg-blue-50' },
  M2: { code: 'M2', label: 'Ödənişli əlavə məzuniyyət', color: 'bg-teal-600', bg: 'bg-teal-50' },
  YM: { code: 'YM', label: 'Yaradıcılıq məzuniyyəti', color: 'bg-violet-600', bg: 'bg-violet-50' },
  TM: { code: 'TM', label: 'Təhsil Məzuniyyəti', color: 'bg-orange-500', bg: 'bg-orange-50' },
  SM: { code: 'SM', label: 'Sosial Məzuniyyət', color: 'bg-pink-600', bg: 'bg-pink-50' },
  ÖM: { code: 'ÖM', label: 'Ödənişsiz məzuniyyət', color: 'bg-slate-400', bg: 'bg-slate-50' },
  İ: { code: 'İ', label: 'İstirahət Günü', color: 'bg-slate-200', bg: 'bg-slate-100' },
  B: { code: 'B', label: 'Bayram Günü', color: 'bg-rose-500', bg: 'bg-rose-50' },
  H: { code: 'H', label: 'Hüzn Günü', color: 'bg-slate-900', bg: 'bg-slate-200' },
  E: { code: 'E', label: 'Ezamiyyə Günü', color: 'bg-indigo-500', bg: 'bg-indigo-50' },
  XV: { code: 'XV', label: 'İşçinin xəstə olması (XV)', color: 'bg-amber-500', bg: 'bg-amber-50' },
};

const Attendance = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // October 2024
  const [dept, setDept] = useState('Bütün Şöbələr');
  const [selectedShift, setSelectedShift] = useState('Bütün Qrafiklər');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [calendars, setCalendars] = useState<Record<string, any>>({});
  const [attendance, setAttendance] = useState<AttendanceData>({});
  const [individualLocks, setIndividualLocks] = useState<Record<string, boolean>>({});
  
  const [isDataRestored, setIsDataRestored] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [periodStatus, setPeriodStatus] = useState<string>('NOT_FOUND');
  const [isLocked, setIsLocked] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const { activeCompany } = useCompany();
  const { formatNumber, formatCurrency, formatDate } = useFormat();
  const companyId = activeCompany?.id || 'COM-001';
  const tableRef = useRef<HTMLTableElement>(null);

  // Navigation Logic
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    resetStates();
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    resetStates();
  };

  const handlePrevYear = () => {
    setCurrentDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
    resetStates();
  };

  const handleNextYear = () => {
    setCurrentDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
    resetStates();
  };

  const resetStates = () => {
    setIsGenerated(false);
    setIsFilled(false);
    setAttendance({});
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1));
    resetStates();
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1));
    resetStates();
  };

  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  
  const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

  // Responsive logic for Fullscreen
  const layoutContext: any = useOutletContext();
  const setIsContentFullscreen = layoutContext?.setIsContentFullscreen;
  const isFullScreen = layoutContext?.isContentFullscreen;

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const loadStatus = async () => {
    try {
        const res = await hrApi.getAttendanceStatus(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId);
        setPeriodStatus(res.status);
        setIsLocked(res.status === 'APPROVED' || res.status === 'POSTED');
    } catch (e) {
        setPeriodStatus('NOT_FOUND');
        setIsLocked(false);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [empData, shiftData, statusRes, leavesData, matrixRes] = await Promise.all([
        hrApi.getEmployees(companyId),
        hrApi.getShifts(companyId),
        hrApi.getAttendanceStatus(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId),
        hrApi.getLeaveRequests(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId),
        hrApi.getAttendanceMatrix(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId).catch(() => [])
      ]);

      setShifts(shiftData);
      setEmployees(empData);
      setPeriodStatus(statusRes.status);
      setIsLocked(statusRes.status === 'APPROVED' || statusRes.status === 'POSTED');
      setLeaveRequests(leavesData);

      // Convert matrixRes to internal format if needed (or just use it)
      // Actually Attendance.tsx uses a slightly different data structure than MatrixRow
      // For now, let's just make sure loadStatus is correct
      await loadStatus();
    } catch (err) {
      console.error('LOAD_DATA_ERROR:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // INITIAL LOAD (Settings & Shifts)
  useEffect(() => {
    loadData();
  }, [currentDate, companyId]);

  const handleFormulate = async () => {
    if (!window.confirm(`${months[currentDate.getMonth()]} ${currentDate.getFullYear()} üçün tabel formalaşdırılsın və doldurulsun?`)) return;
    
    try {
      setIsProcessing(true);
      await hrApi.generateAttendance(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId, true);
      await loadStatus();
      window.location.reload(); // Refresh to ensure pure backend data is shown
    } catch (err: any) {
      alert('Xəta: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper to calculate hours from IN/OUT logs
  const calculateWorkedHours = (logs: any[]) => {
    if (!logs || logs.length === 0) return 0;
    
    const sorted = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    let totalMs = 0;
    let lastIn: number | null = null;
    
    sorted.forEach(log => {
      if (log.type === 'IN') {
        lastIn = new Date(log.timestamp).getTime();
      } else if (log.type === 'OUT' && lastIn !== null) {
        totalMs += (new Date(log.timestamp).getTime() - lastIn);
        lastIn = null;
      }
    });
    
    const hours = totalMs / (1000 * 60 * 60);
    return Math.round(hours * 100) / 100;
  };

  const getDayScheduleHours = (shift: any, dayOfWeek: number, isShortDay: boolean) => {
    if (!shift) return 8;
    let baseHours = 8;
    try {
      const settings = typeof shift.dailySettings === 'string' ? JSON.parse(shift.dailySettings) : (shift.dailySettings || {});
      const dayKey = dayOfWeek === 0 ? "0" : dayOfWeek.toString(); // Sunday is 0 in JS, match ProductionCalendar
      const setting = settings[dayKey];

      const parseTime = (s: string) => {
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

      let start = parseTime(shift.startTime || '09:00');
      let end = parseTime(shift.endTime || '18:00');
      let lunchMin = Number(shift.lunchDurationMin || 0);

      if (setting) {
        if (setting.start && setting.end) {
          start = parseTime(setting.start);
          end = parseTime(setting.end);
        }
        if (setting.lunchStart && setting.lunchEnd) {
          lunchMin = parseTime(setting.lunchEnd) - parseTime(setting.lunchStart);
        }
      }
      
      baseHours = (end - start - lunchMin) / 60;
      if (baseHours < 0) baseHours = 0;

    } catch (e) { 
      console.error('getDayScheduleHours Error:', e);
      baseHours = 8; 
    }
    
    if (isShortDay) baseHours = Math.max(0, baseHours - 1);
    return Math.round(baseHours * 10) / 10;
  };

  const handleFill = async () => {
    if (!isGenerated) return;
    try {
      setIsProcessing(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const uniqueShiftIds = Array.from(new Set(employees.map((e: any) => e.workShiftId || 'default')));
      const calResults: Record<string, any> = {};
      
      await Promise.all(uniqueShiftIds.map(async (sid: any) => {
        try {
          const cal = await hrApi.getCalendar(year, companyId, sid === 'default' ? undefined : sid);
          const dayMap: Record<number, any> = {};
          cal.forEach((d: any) => {
            const dt = new Date(d.date);
      // Use local properties to avoid UTC shift
      // If date is stored as "2024-10-01", new Date(d.date) might shift.
      // Better to check the date string directly if possible, but let's assume consistent local data for now.
      if (month !== null && dt.getMonth() !== month) return;
dayMap[dt.getDate()] = d;
          });
          calResults[sid] = dayMap;
        } catch(e) { calResults[sid] = {}; }
      }));
      setCalendars(calResults);

      const allLogs = await hrApi.getAttendanceLogs('', companyId);
      const logsMap: Record<string, Record<number, any[]>> = {};
      
      allLogs.forEach((log: any) => {
        const logDate = new Date(log.timestamp);
        if (logDate.getFullYear() === year && logDate.getMonth() === month) {
          const empId = log.employeeId;
          const day = logDate.getDate();
          if (!logsMap[empId]) logsMap[empId] = {};
          if (!logsMap[empId][day]) logsMap[empId][day] = [];
          logsMap[empId][day].push(log);
        }
      });

      const matrix: AttendanceData = {};
      employees.forEach((emp) => {
        matrix[emp.id] = {};
        const sid = emp.workShiftId || 'default';
        const shiftCal = calResults[sid] || {};
        const empLogsByDay = logsMap[emp.id] || {};

        for (let d = 1; d <= daysInMonth; d++) {
          const dt = new Date(year, month, d);
          const dtMidnight = new Date(dt);
          dtMidnight.setHours(0,0,0,0);

          const hDate = emp.startDate ? new Date(emp.startDate) : null;
          const tDate = emp.deletedAt ? new Date(emp.deletedAt) : null;
          
          if (hDate) hDate.setHours(0,0,0,0);
          if (tDate) tDate.setHours(23,59,59,999);
          
          const calDef = shiftCal[d];
          const isWorkDay = calDef ? calDef.isWorkDay : (dt.getDay() !== 0 && dt.getDay() !== 6);
          const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;

          if (hDate && dtMidnight < hDate) {
            matrix[emp.id][d] = { status: isWorkDay ? 'AO' : (isWeekend ? 'İ' : 'B') };
            continue;
          }
          if (tDate && dtMidnight > tDate) {
            matrix[emp.id][d] = { status: 'X' };
            continue;
          }

          const activeLeave = leaveRequests.find((lr: any) => {
            if (lr.employeeId !== emp.id || lr.status !== 'APPROVED') return false;
            const start = new Date(new Date(lr.startDate).setHours(0,0,0,0));
            const end = new Date(new Date(lr.endDate).setHours(23,59,59,999));
            return dtMidnight >= start && dtMidnight <= end;
          });

          if (activeLeave) {
            const typeCode = activeLeave.leaveType?.code || 'ANNUAL';
            let status = 'M1';
            if (typeCode === 'ANNUAL') status = 'M1';
            else if (typeCode === 'ADDITIONAL') status = 'M2';
            else if (typeCode === 'CREATIVE') status = 'YM';
            else if (typeCode === 'EDUCATIONAL') status = 'TM';
            else if (typeCode === 'SOCIAL') status = 'SM';
            else if (typeCode === 'UNPAID') status = 'ÖM';
            else if (typeCode === 'SICK') status = 'XV';
            else if (typeCode === 'TRIP') status = 'E';
            matrix[emp.id][d] = { status };
            continue;
          }

          const dayLogs = empLogsByDay[d] || [];
          const workedHours = calculateWorkedHours(dayLogs);

          if (workedHours > 0) {
            if (!isWorkDay) {
              matrix[emp.id][d] = { status: 'GN', hours: workedHours };
            } else {
              matrix[emp.id][d] = { status: 'WORK', hours: workedHours };
            }
          } else {
            if (isWorkDay) {
                // If it's a workday but NO LOGS, we fill with the schedule's official hours
                const shift = shifts.find(s => s.id === sid);
                const fillHours = getDayScheduleHours(shift, dt.getDay(), calDef?.type === 'SHORT_DAY');
                matrix[emp.id][d] = { status: 'WORK', hours: fillHours }; 
            } else {
                matrix[emp.id][d] = { status: 'İ' }; // Always İ (İstirahət) for non-workdays by default
            }
          }
        }
      });
      setAttendance(matrix);
      setIsFilled(true);
    } catch (err) {
      console.error('FILL_ERROR:', err);
      alert('Doldurulma zamanı xəta baş verdi.');
    } finally {
      setIsProcessing(false);
    }
  };


  const handleToggleLock = (empId?: string) => {
    if (empId) {
      setIndividualLocks(prev => ({ ...prev, [empId]: !prev[empId] }));
    } else {
      // Global lock now means changing periodStatus to POSTED or back
      const target = periodStatus === 'POSTED' ? 'APPROVED' : 'POSTED';
      handleApproveRange(target);
    }
  };

  const handleApproveRange = async (status: string) => {
    try {
      setIsProcessing(true);
      await hrApi.approveAttendance(
        currentDate.getMonth() + 1, 
        currentDate.getFullYear(), 
        companyId, 
        status
      );
      setPeriodStatus(status);
      setIsLocked(status === 'APPROVED' || status === 'POSTED');
      alert(`Status uğurla dəyişdirildi: ${status}`);
    } catch (err: any) {
      alert('Xəta baş verdi: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
        setIsProcessing(true);
        const updates: any[] = [];
        
        Object.keys(attendance).forEach(empId => {
            const row = attendance[empId];
            Object.keys(row).forEach(dayKey => {
                const day = row[parseInt(dayKey)];
                if (day && day.id) {
                    updates.push({
                        id: day.id,
                        status: day.status,
                        hoursWorked: day.hours
                    });
                }
            });
        });

        if (updates.length === 0) {
            alert('Yadda saxlamaq üçün dəyişiklik tapılmadı və ya data tam yüklənməyib.');
            return;
        }

        await hrApi.batchUpdateAttendanceDetails(updates, companyId);
        alert('Məlumatlar uğurla yadda saxlanıldı.');
    } catch (error: any) {
        alert('Xəta baş verdi: ' + error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [empData, shiftData, statusRes, leavesData, matrixRes] = await Promise.all([
          hrApi.getEmployees(companyId),
          hrApi.getShifts(companyId),
          hrApi.getAttendanceStatus(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId),
          hrApi.getLeaveRequests(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId),
          hrApi.getAttendanceMatrix(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId).catch(() => [])
        ]);

        const currentStatus = statusRes.status && statusRes.status !== 'NOT_FOUND' ? statusRes.status : 'DRAFT';
        setPeriodStatus(currentStatus);
        setIsLocked(currentStatus === 'APPROVED' || currentStatus === 'POSTED');

        setIsGenerated(true);
        setLeaveRequests(leavesData);
        
        const mappedEmps: Employee[] = empData.length > 0 ? empData.map((e: any) => ({
          id: e.id,
          fullName: e.fullName,
          code: e.code || '---',
          fin: e.fin || '---',
          pos: e.position || e.jobPosition?.name || "İşçi",
          dept: e.department?.name || "Bütün Şöbələr",
          workplaceType: e.workplaceType || 'ƏSAS',
          startDate: e.startDate,
          status: e.status,
          deletedAt: e.deletedAt,
          workShiftId: e.workShiftId
        })) : [];
        
        setEmployees(mappedEmps);
        setShifts(shiftData);

        const uniqueShiftIds = Array.from(new Set(mappedEmps.map((e: any) => e.workShiftId || 'default')));
        const calResults: Record<string, any> = {};
        
        await Promise.all(uniqueShiftIds.map(async (sid: any) => {
          try {
            const cal = await hrApi.getCalendar(currentDate.getFullYear(), companyId, sid === 'default' ? undefined : sid);
            const dayMap: Record<number, any> = {};
            cal.forEach((d: any) => {
              const dt = new Date(d.date);
              if (dt.getMonth() === currentDate.getMonth()) {
                  dayMap[dt.getDate()] = d;
              }
            });
            calResults[sid] = dayMap;
          } catch(e) { calResults[sid] = {}; }
        }));
        setCalendars(calResults);

        const matrix: AttendanceData = {};
        mappedEmps.forEach((emp: Employee) => {
          matrix[emp.id] = {};
          
          // Check if we have existing data from backend
          const backendRow = matrixRes.find((h: any) => h.employeeId === emp.id);
          if (backendRow && backendRow.details && backendRow.details.length > 0) {
              backendRow.details.forEach((det: any) => {
                  matrix[emp.id][det.day] = {
                      id: det.id,
                      status: det.status,
                      hours: det.hoursWorked
                  };
              });
              // Fill missing days if any
              for (let d = 1; d <= daysInMonth; d++) {
                  if (!matrix[emp.id][d]) matrix[emp.id][d] = { status: 'İ' };
              }
          } else {
              const sid = emp.workShiftId || 'default';
              const shiftCal = calResults[sid] || {};
              
              for (let d = 1; d <= daysInMonth; d++) {
                 const dt = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
                 const hDate = emp.startDate ? new Date(emp.startDate) : null;
                 const tDate = emp.deletedAt ? new Date(emp.deletedAt) : null;
                 
                 if (hDate && dt < new Date(hDate.setHours(0,0,0,0))) {
                    matrix[emp.id][d] = { status: 'MD' };
                    continue;
                 }
                 if (tDate && dt > new Date(tDate.setHours(23,59,59,999))) {
                    matrix[emp.id][d] = { status: 'X' };
                    continue;
                 }

                 const activeLeave = leavesData.find((lr: any) => {
                     if (lr.employeeId !== emp.id || lr.status !== 'APPROVED') return false;
                     const start = new Date(lr.startDate);
                     const end = new Date(lr.endDate);
                     start.setHours(0,0,0,0);
                     end.setHours(23,59,59,999);
                     return dt >= start && dt <= end;
                 });

                 if (activeLeave) {
                     const typeCode = activeLeave.leaveType?.code || 'ANNUAL';
                     let lStatus = 'M1';
                     if (typeCode === 'ANNUAL') lStatus = 'M1';
                     else if (typeCode === 'ADDITIONAL') lStatus = 'M2';
                     else if (typeCode === 'SICK') lStatus = 'XV';
                     else if (typeCode === 'UNPAID') lStatus = 'ÖM';
                     else if (typeCode === 'TRIP') lStatus = 'E';
                     matrix[emp.id][d] = { status: lStatus };
                     continue;
                 }

                 const calDef = shiftCal[d];
                 const isWorkDay = calDef ? calDef.isWorkDay : (dt.getDay() !== 0 && dt.getDay() !== 6);

                 if (isWorkDay) {
                    matrix[emp.id][d] = { status: 'WORK', hours: 0 }; 
                 } else {
                    matrix[emp.id][d] = { status: 'İ' }; 
                 }
              }
          }
        });
        setAttendance(matrix);
      } catch (err) {
        console.error('FETCH_ATTENDANCE_ERROR:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [currentDate, daysInMonth, companyId]);

  const filteredEmployees = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    return employees.filter(emp => {
      // 1. Basic filters (Dept, Shift)
      const matchDept = dept === 'Bütün Şöbələr' || emp.dept === dept;
      const matchShift = selectedShift === 'Bütün Qrafiklər' || emp.workShiftId === selectedShift;
      
      if (!matchDept || !matchShift) return false;

      // 2. Date filtering
      const empStart = new Date(emp.startDate);
      // If employee starts after this month, hide them
      if (empStart > endOfMonth) return false;

      // If employee was deleted/terminated before this month, hide them
      if (emp.deletedAt) {
        const empEnd = new Date(emp.deletedAt);
        if (empEnd < startOfMonth) return false;
      }

      return true;
    });
  }, [employees, dept, selectedShift, currentDate]);

  useLayoutEffect(() => {
    const measure = () => {
      if (tableRef.current && filteredEmployees.length > 0) {
        const bodyRow = tableRef.current.querySelector('tbody tr');
        if (bodyRow) {
          const cells = Array.from(bodyRow.children).slice(0, 4) as HTMLElement[];
          let cumulative = 0;
          cells.forEach((cell, idx) => {
            const width = cell.getBoundingClientRect().width;
            tableRef.current?.style.setProperty(`--col-${idx + 1}-w`, `${width}px`);
            tableRef.current?.style.setProperty(`--col-${idx + 1}-offset`, `${cumulative}px`);
            cumulative += width;
          });
        }
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [filteredEmployees, attendance]);

  const toggleStatus = (empId: string, day: number) => {
    const sequence = ['WORK', 'AO', 'M1', 'M2', 'YM', 'TM', 'SM', 'ÖM', 'İ', 'B', 'E', 'XV'];
    setAttendance(prev => {
      const empRow = prev[empId];
      if (!empRow || !empRow[day]) return prev;
      
      const current = empRow[day].status;
      if (current === 'X') return prev; // Terminated days remain as X

      let nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
      if (nextIdx === -1) nextIdx = 0;
      const nextStatus = sequence[nextIdx];
      
      let nextData: DayStatus = { status: nextStatus };
      if (nextStatus === 'WORK') nextData.hours = 8;
      else if (nextStatus === 'E') nextData.hours = 8; // Trips get full shift hours (8 as default, but backend ensures shift norm)
      else nextData.hours = 0; // Most others get 0 hours
      
      return {
        ...prev,
        [empId]: { ...empRow, [day]: nextData }
      };
    });
  };

  const getStats = (empId: string) => {
    const row = attendance[empId];
    if (!row) return { totalHours: 0 };
    let total = 0;
    Object.values(row).forEach(day => {
      // Include WORK, E (Trip or manual fact work on rest days)
      if (['WORK', 'E', 'İ', 'B'].includes(day.status)) {
         total += Number(day.hours || 0);
      }
    });
    return { totalHours: Math.round(total * 100) / 100 };
  };


  const handleResetAttendance = async () => {
    if (!window.confirm(`${currentDate.getMonth() + 1}/${currentDate.getFullYear()} tarixinə aid bütün tabel başlığını (header) və yadda saxlanılmış məlumatları sıfırlamaq istədiyinizə əminsiniz?`)) {
      return;
    }
    
    try {
      setIsProcessing(true);
      await hrApi.resetAttendance(currentDate.getMonth() + 1, currentDate.getFullYear(), companyId);
      
      // Full internal reset instead of window.location.reload() for better UX
      setAttendance({});
      setEmployees([]);
      setIsGenerated(false);
      setIsFilled(false);
      
      alert('Tabel uğurla təmizləndi.');
      // Optional: scroll to top or trigger a new formulation
    } catch (error: any) {
      alert('Sıfırlama zamanı xəta: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };


  const calendarStats = useMemo(() => {
    let targetSid = selectedShift;
    if (targetSid === 'Bütün Qrafiklər') {
       targetSid = Object.keys(calendars)[0] || 'default';
    }
    
    const shiftCal = calendars[targetSid] || {};
    const currentShift = shifts.find(s => s.id === (targetSid === 'default' ? '' : targetSid));
    
    let workDays = 0, hours = 0, holidays = 0;
    
    Object.values(shiftCal).forEach((d: any) => {
      if (d.isWorkDay) {
         workDays++;
         const dt = new Date(d.date);
         const dayHours = getDayScheduleHours(currentShift, dt.getDay(), d.type === 'SHORT_DAY');
         hours += dayHours;
      } else {
         holidays++;
      }
    });

    if (workDays === 0) { // Fallback if no calendar data
        return { workDays: 22, hours: 176, holidays: 9 };
    }

    return { workDays, hours, holidays };
  }, [calendars, selectedShift]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] italic font-black uppercase">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 px-0"></div>
      </div>
    );
  }

  return (
    <div className={`max-w-full animate-in fade-in duration-700 pb-20 ${isFullScreen ? 'bg-white dark:bg-slate-900 overflow-y-auto p-12 h-screen' : ''}`}>
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">İş Rejimi Və Tabel</h2>
          <div className="flex items-center text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1 leading-none italic">
            <Calendar className="w-3 h-3 mr-2 text-primary-500 shadow-sm px-0" />
            <span>HR MODULU</span>
            <ChevronRight className="w-3 h-3 mx-2 text-slate-300" />
            <span className="text-primary-500 italic">
               {currentDate.toLocaleString('az-AZ', { month: 'long' })} {currentDate.getFullYear()} TABELİ
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* Month Dropdown */}
          <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm italic font-black uppercase leading-none">
            <select 
              value={currentDate.getMonth()} 
              onChange={handleMonthChange}
              className="bg-transparent border-none px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer italic leading-none appearance-none"
            >
              {months.map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div className="flex bg-white rounded-2xl border border-slate-200 p-1 shadow-sm italic font-black uppercase leading-none">
            <select 
              value={currentDate.getFullYear()} 
              onChange={handleYearChange}
              className="bg-transparent border-none px-4 py-2 text-[11px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer italic leading-none appearance-none"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <select 
            value={selectedShift} 
            onChange={(e) => setSelectedShift(e.target.value)}
            className="bg-white border border-slate-200 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-primary-500 outline-none shadow-sm italic leading-none"
          >
            <option value="Bütün Qrafiklər">Bütün Qrafiklər</option>
            {shifts.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-3">
            {/* SEQUENTIAL ACTION FLOW */}
            {periodStatus === 'NOT_FOUND' && (
                <button 
                  onClick={handleFormulate}
                  disabled={isProcessing}
                  className="flex items-center px-8 py-3.5 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Zap className="w-4 h-4 mr-2" />}
                  Formalaşdır
                </button>
            )}

            {periodStatus === 'DRAFT' && (
                <div className="flex items-center gap-3">
                    <button 
                      onClick={handleSave}
                      disabled={isProcessing}
                      className="flex items-center px-8 py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Yadda Sahla
                    </button>
                    <button 
                      onClick={() => handleApproveRange('APPROVED')}
                      disabled={isProcessing}
                      className="flex items-center px-8 py-3.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-200"
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Təsdiq et
                    </button>
                    <button 
                      onClick={handleResetAttendance}
                      disabled={isProcessing}
                      className="flex items-center px-6 py-3.5 border-2 border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Təmizlə
                    </button>
                </div>
            )}

            {periodStatus === 'APPROVED' && (
                <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleApproveRange('POSTED')}
                      className="flex items-center px-10 py-3.5 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-slate-300"
                    >
                      <Lock className="w-4 h-4 mr-2 text-emerald-400" />
                      Kilidlə
                    </button>
                    <button 
                      onClick={() => handleApproveRange('DRAFT')}
                      className="flex items-center px-8 py-3.5 bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Təsdiqi ləğv et
                    </button>
                </div>
            )}

            {periodStatus === 'POSTED' && (
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span className="text-[11px] font-black text-emerald-900 uppercase tracking-widest">Tabel Kilidlənib</span>
                    </div>
                    <button 
                        onClick={() => handleApproveRange('APPROVED')}
                        className="flex items-center px-8 py-3.5 bg-white border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm"
                    >
                        <Unlock className="w-4 h-4 mr-2" />
                        Kilidi aç (Unlock)
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Warning Bar */}
      <div className="mb-6 px-2">
        <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 flex items-start space-x-4 shadow-sm">
          <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
             <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-amber-800 uppercase tracking-widest mb-1 italic">
              {currentDate.toLocaleString('az-AZ', { month: 'long' })} {currentDate.getFullYear()} Giriş/Çıxış Xəbərdarlığı
            </h4>
            <p className="text-[10px] text-amber-700 font-bold leading-relaxed uppercase tracking-tighter italic">
              Sistem işə başlama və xitam tarixlərini, həmçinin İstehsalat Təqvimi və İş Qrafiklərini nəzərə alaraq bəzi xanalara redaktəni qapatmışdır (MD və X statusları). Zəhmət olmasa, tabeli təsdiqləməzdən əvvəl məlumatların doğruluğunu yoxlayın.
            </p>
          </div>
        </div>
      </div>

      {/* Normative Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 px-2 italic font-black uppercase leading-none">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 flex flex-1 items-center border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Calendar className="w-12 h-12 px-0" />
            </div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mr-5 shrink-0">
               <Calendar className="w-6 h-6 text-indigo-600 px-0" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 italic leading-none">İş Günləri (Norma)</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter mr-2 italic">{calendarStats.workDays} / {daysInMonth}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Gün</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 flex flex-1 items-center border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock className="w-12 h-12 px-0" />
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mr-5 shrink-0">
               <Clock className="w-6 h-6 text-emerald-600 px-0" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 italic leading-none">Normativ Saat</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter mr-2 italic">{formatNumber(calendarStats.hours, 1)}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Saat</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 flex flex-1 items-center border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
              <Info className="w-12 h-12 px-0" />
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mr-5 shrink-0">
               <Info className="w-6 h-6 text-amber-600 px-0" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 italic leading-none">Bayram / İstirahət</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter mr-2 italic">{calendarStats.holidays}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Gün</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 flex flex-1 items-center shadow-xl relative overflow-hidden group shadow-indigo-500/10">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-12 h-12 text-white px-0" />
            </div>
            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mr-5 shrink-0">
               <Users className="w-6 h-6 text-indigo-400 px-0" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 italic leading-none">Aktiv Personallar</p>
              <div className="flex items-baseline">
                <span className="text-2xl font-black text-white tracking-tighter mr-2 italic">{filteredEmployees.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Nəfər</span>
              </div>
            </div>
          </div>
      </div>

      {/* Main Grid Card */}
      <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl shadow-slate-200 dark:shadow-none border border-white dark:border-slate-800 overflow-hidden">
        
        {/* Table Legend */}

        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent italic leading-none font-black uppercase">
          <table ref={tableRef} className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-[#FAFBFD]/80 dark:bg-slate-800/50">
                <th rowSpan={2} className="sticky left-0 z-40 bg-[#FAFBFD] dark:bg-slate-900 px-4 py-2 text-center border-b border-r border-slate-100 dark:border-slate-800">
                   <span className="text-[11px] font-black text-slate-400 uppercase italic">№</span>
                </th>
                <th rowSpan={2} className="sticky left-[var(--col-2-offset,48px)] z-40 bg-[#FAFBFD] dark:bg-slate-900 px-6 py-2 text-left border-b border-r border-slate-100 dark:border-slate-800">
                   <span className="text-[11px] font-black text-slate-400 uppercase italic">İşçi / FİN</span>
                </th>
                <th rowSpan={2} className="sticky left-[var(--col-3-offset,348px)] z-40 bg-[#FAFBFD] dark:bg-slate-900 px-6 py-2 text-left border-b border-r border-slate-100 dark:border-slate-800">
                   <span className="text-[11px] font-black text-slate-400 uppercase italic">Şöbə / Vəzifə</span>
                </th>
                <th rowSpan={2} className="sticky left-[var(--col-4-offset,588px)] z-40 bg-[#FAFBFD] dark:bg-slate-900 px-4 py-2 text-center border-b border-r border-slate-100 dark:border-slate-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                   <span className="text-[11px] font-black text-slate-400 uppercase italic">İş yeri</span>
                </th>
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <th key={i} className="p-4 border-b border-slate-100 dark:border-slate-800 text-center min-w-[50px]">
                    <span className="text-[10px] font-black text-slate-400 tabular-nums italic">{["B", "BE", "ÇA", "Ç", "CA", "C", "Ş"][new Date(currentDate.getFullYear(), currentDate.getMonth(), i+1).getDay()]}</span>
                  </th>
                ))}
                <th rowSpan={2} className="sticky right-[100px] z-40 bg-[#FAFBFD] dark:bg-slate-900 p-6 text-center border-b border-l border-slate-100 dark:border-slate-800 min-w-[100px] border-r">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic leading-none">NORM</span>
                </th>
                <th rowSpan={2} className="sticky right-0 z-40 bg-[#FAFBFD] dark:bg-slate-900 p-6 text-center border-b border-l border-slate-100 dark:border-slate-800 min-w-[100px]">
                   <span className="text-[11px] font-black text-emerald-500 uppercase tracking-widest italic leading-none">FAKTİKİ</span>
                </th>
              </tr>
              <tr className="bg-white dark:bg-slate-800/20">
                {Array.from({ length: daysInMonth }).map((_, i) => (
                    <th key={i} className="p-2 border-b border-slate-100 dark:border-slate-800 text-center text-[10px] font-black text-slate-400">{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredEmployees.map((emp) => {
                const stats = getStats(emp.id);
                const isItemLocked = isLocked || individualLocks[emp.id];
                const shiftId = emp.workShiftId || 'default';
                const shiftCal = calendars[shiftId] || {};
                const shiftObj = shifts.find(s => s.id === shiftId);
                
                // Calculate normative hours for this employee strictly from shift calendar and daily settings
                let empNorm = 0;
                Object.values(shiftCal).forEach((d: any) => { 
                  if(d.isWorkDay) {
                    const dt = new Date(d.date);
                    empNorm += getDayScheduleHours(shiftObj, dt.getDay(), d.type === 'SHORT_DAY');
                  } 
                });
                if (empNorm === 0) empNorm = 176;


                return (
                  <tr key={emp.id} className={`group transition-colors ${isItemLocked ? 'bg-slate-50/50 dark:bg-slate-800/20 opacity-90' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'}`}>
                    <td className="sticky left-0 z-30 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 p-2 text-center border-r border-slate-100 dark:border-slate-800 whitespace-nowrap">
                        <button 
                            onClick={() => handleToggleLock(emp.id)}
                            className={`p-1.5 rounded-lg transition-all ${isItemLocked ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-slate-300 hover:text-indigo-500 hover:bg-indigo-50'}`}
                        >
                            {isItemLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>
                    </td>
                    <td className="sticky left-[var(--col-2-offset,48px)] z-30 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 p-4 border-r border-slate-100 dark:border-slate-800 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic">{emp.fullName}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[8px] font-bold text-slate-400 uppercase italic leading-none">{emp.code || '---'}</span>
                           <div className="w-1 h-1 rounded-full bg-slate-200" />
                           <span className="text-[8px] font-black text-indigo-500 uppercase italic uppercase">{emp.fin || '---'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="sticky left-[var(--col-3-offset,348px)] z-30 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 p-4 border-r border-slate-100 dark:border-slate-800 whitespace-nowrap">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase italic">{emp.dept || 'Ümumi Şöbə'}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{emp.pos || 'İşçi'}</span>
                       </div>
                    </td>
                    <td className="sticky left-[var(--col-4-offset,588px)] z-30 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 p-4 border-r border-slate-100 dark:border-slate-800 text-center shadow-[2px_0_5px_rgba(0,0,0,0.05)] whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase ${emp.workplaceType === 'ƏLAVƏ' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                           {emp.workplaceType || 'ƏSAS'}
                        </span>
                    </td>
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const dayData = attendance[emp.id]?.[day];
                      if (!dayData) return <td key={day} className="p-1 min-w-[36px] h-[36px] border border-slate-50 dark:border-slate-800/30"></td>;
                      
                      const s = dayData.status ? STATUSES[dayData.status] : null;
                      const isControlDisabled = isItemLocked || dayData.status === 'MD' || dayData.status === 'X';

                      return (
                        <td 
                          key={day} 
                          className="p-1 min-w-[42px] min-h-[48px] text-center"
                          onClick={() => !isControlDisabled && toggleStatus(emp.id, day)}
                        >
                          <div className={`w-full py-1 rounded-xl flex flex-col items-center justify-center transition-all ${isControlDisabled ? 'cursor-not-allowed grayscale-[0.8]' : 'cursor-pointer hover:shadow-lg hover:scale-105'} ${s ? s.bg : 'bg-slate-50/30'} border border-slate-200/60 dark:border-slate-700/60 relative overflow-hidden shadow-sm`}>
                            <span className={`text-[8px] font-black uppercase tracking-wider ${s ? (s.color.replace('bg-', 'text-')) : 'text-slate-400'} italic leading-none my-1`}>
                              {s ? s.code : '---'}
                            </span>
                            <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700"></div>
                            <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 tabular-nums italic leading-none my-1.5">
                              {['WORK', 'E', 'İ', 'B'].includes(dayData.status) ? (dayData.hours || 0) : '0'}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                    <td className="sticky right-[100px] z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 p-6 border-l border-slate-100 dark:border-slate-800 text-center shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.03)] border-r">
                       <span className="text-sm font-black text-slate-400 tabular-nums italic leading-none opacity-50">{formatNumber(empNorm, 1)}</span>
                    </td>
                    <td className="sticky right-0 z-10 bg-white dark:bg-slate-900 group-hover:bg-slate-50 dark:group-hover:bg-slate-800 p-6 border-l border-slate-100 dark:border-slate-800 text-center shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.03)]">
                       <span className={`text-sm font-black tabular-nums italic leading-none ${stats.totalHours < empNorm ? 'text-rose-500' : 'text-emerald-500'}`}>{formatNumber(stats.totalHours, 2)}</span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Info Only */}
        <div className="p-10 bg-[#FAFBFD]/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 italic font-black uppercase leading-none">
           <div className="flex items-center text-slate-400">
              <Info className="w-5 h-5 mr-3 text-primary-400 px-0" />
              <p className="text-[11px] font-bold uppercase tracking-widest italic leading-relaxed leading-none">
                Hüceyrələrə klikləməklə statusları sürətlə dəyişə bilərsiniz. <br/>
                <span className="text-slate-300">AO (İşə qəbul) və X (Xitam) statuslu xanalar redaktəyə qapalıdır.</span>
              </p>
           </div>
        </div>
      </div>

      {/* Legend / Status Information at the Bottom */}
      <div className="mt-12 px-2 pb-12">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <Info className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest italic leading-none">Status Arayış Və Təlimatları</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase italic mt-1 leading-none tracking-tight">Cədvəldə istifadə olunan qısaltmaların mənaları</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4 gap-x-8">
            {Object.entries(STATUSES).map(([key, value]) => (
              <div key={key} className="flex items-start group">
                <div className={`w-2 h-7 rounded-full ${value.color} mr-4 shrink-0 shadow-sm transition-transform group-hover:scale-y-110`}></div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-800 dark:text-white uppercase italic leading-none">
                      {value.label}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-800 rounded uppercase italic leading-none">
                      {value.code}
                    </span>
                  </div>
                  {value.description && (
                    <p className="text-[9px] text-slate-400 font-bold uppercase italic mt-1.5 leading-tight tracking-tight max-w-[200px]">
                      {value.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">Sistem Avtomatik Hesablama Modulu Aktivdir</span>
            </div>
            <p className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest">TENGRY SUPPLY ERP • v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
