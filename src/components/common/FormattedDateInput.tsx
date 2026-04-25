import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { useFormat } from '../../context/FormatContext';

interface FormattedDateInputProps {
  value: string; // ISO format (YYYY-MM-DD)
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  iconColor?: string;
}

const FormattedDateInput: React.FC<FormattedDateInputProps> = ({ 
  value, 
  onChange, 
  label, 
  className = "", 
  iconColor = "text-emerald-500"
}) => {
  const { formatDate } = useFormat();
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = value ? formatDate(value) : "";

  const handleContainerClick = () => {
    // Open the native date picker
    if (inputRef.current) {
        try {
            // Modern browsers support showPicker()
            (inputRef.current as any).showPicker();
        } catch (e) {
            // Fallback: focus the input
            inputRef.current.focus();
        }
    }
  };

  return (
    <div className={`space-y-3 leading-none text-left ${className}`}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase italic ml-4 leading-none block mb-1">
          {label}
        </label>
      )}
      <div 
        onClick={handleContainerClick}
        className="relative group cursor-pointer leading-none"
      >
        {/* FAKE VISUAL DISPLAY */}
        <div className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent group-focus-within:border-emerald-500/20 rounded-[2rem] py-5 px-8 text-xs font-black italic shadow-inner outline-none flex items-center justify-between transition-all leading-none">
          <span className={`${value ? 'text-slate-800 dark:text-white' : 'text-slate-400'} leading-none`}>
            {value ? displayValue : "SEÇİN..."}
          </span>
          <Calendar className={`w-4 h-4 ${iconColor} opacity-50 group-hover:opacity-100 transition-all leading-none`} />
        </div>

        {/* HIDDEN NATIVE INPUT FOR ENGINE */}
        <input 
          ref={inputRef}
          type="date" 
          value={value || ""} 
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 pointer-events-none w-full h-full leading-none"
        />
      </div>
    </div>
  );
};

export default FormattedDateInput;
