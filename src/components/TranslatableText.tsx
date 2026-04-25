import React, { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext';
import { Languages } from 'lucide-react';

interface TranslatableTextProps {
  entity: string;
  entityId: string;
  field: string;
  value: any;
  className?: string;
}

const TranslatableText: React.FC<TranslatableTextProps> = ({ entity, entityId, field, value, className }) => {
  const { translateData } = useLocalization();
  const { value: translatedValue, isTranslated, original } = translateData(entity, entityId, field, value);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isTranslated) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span 
      className="relative inline-block group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className={`cursor-help border-b border-dashed border-indigo-400/50 ${className}`}>
        {translatedValue}
      </span>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white rounded-xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-1">
             <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                <Languages className="w-3 h-3" />
                <span>Orijinal Mətn</span>
             </div>
             <p className="text-xs font-bold italic">{original}</p>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </span>
  );
};

export default TranslatableText;
