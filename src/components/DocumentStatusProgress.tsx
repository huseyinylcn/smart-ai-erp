import React from 'react';
import { Check, Clock, AlertCircle, ShieldCheck, FileType } from 'lucide-react';

export type DocumentStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'POSTED' | 'CANCELLED';

interface StatusStep {
  status: DocumentStatus;
  label: string;
  date?: string;
  user?: string;
}

interface DocumentStatusProgressProps {
  currentStatus: DocumentStatus;
  steps?: StatusStep[];
}

const statusConfig = {
  DRAFT: { color: 'bg-slate-400', icon: FileType, label: 'Qaralama' },
  PENDING: { color: 'bg-amber-500', icon: Clock, label: 'Gözləmədə' },
  APPROVED: { color: 'bg-blue-500', icon: ShieldCheck, label: 'Təsdiqləndi' },
  POSTED: { color: 'bg-emerald-500', icon: Check, label: 'İşlənildi (Posted)' },
  CANCELLED: { color: 'bg-rose-500', icon: AlertCircle, label: 'Ləğv Edildi' },
};

const DocumentStatusProgress: React.FC<DocumentStatusProgressProps> = ({ 
  currentStatus,
  steps = [
    { status: 'DRAFT', label: 'Yaradıldı', date: '2024-03-29 14:20', user: 'Admin' },
    { status: 'PENDING', label: 'Təsdiqə göndərildi', date: '2024-03-30 09:15', user: 'Q. Abbasov' },
    { status: 'APPROVED', label: 'Təsdiq olundu', date: '2024-03-30 10:00', user: 'M. Əliyev' },
    { status: 'POSTED', label: 'Müxabirləşmə verildi', date: '2024-03-30 10:05', user: 'Sistem' },
  ]
}) => {
  return (
    <div className="flex items-center w-full py-4 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto no-scrollbar">
      {steps.map((step, index) => {
        const Config = statusConfig[step.status];
        const isLast = index === steps.length - 1;
        const isActive = steps.findIndex(s => s.status === currentStatus) >= index;

        return (
          <React.Fragment key={step.status}>
            <div className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isActive 
                  ? `${Config.color} text-white shadow-lg ring-4 ring-offset-2 ${Config.color.replace('bg-', 'ring-')}/20 dark:ring-offset-slate-900` 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  <Config.icon className="w-5 h-5" />
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-[11px] font-black uppercase tracking-tighter ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                  {step.date && (
                    <p className="text-[9px] text-slate-400 font-bold mt-0.5">{step.date}</p>
                  )}
                </div>
              </div>
            </div>
            {!isLast && (
              <div className="flex-1 min-w-[40px] h-[2px] mx-4 mb-8 relative">
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                <div 
                  className={`absolute inset-0 transition-all duration-700 rounded-full ${statusConfig[currentStatus].color}`} 
                  style={{ width: isActive ? '100%' : '0%' }}
                ></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default DocumentStatusProgress;
