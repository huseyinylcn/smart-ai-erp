import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';

interface Option {
  id: string;
  label: string;
  subLabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

const SearchableSelect = ({ options, value, onChange, placeholder = "Seçin...", label, className = "" }: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase()) || 
    (opt.subLabel && opt.subLabel.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative flex flex-col space-y-4 w-full ${className}`} ref={dropdownRef}>
      {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-2 leading-none">{label}</label>}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 text-xs font-black italic shadow-inner cursor-pointer flex items-center justify-between transition-all ${isOpen ? 'ring-2 ring-rose-500/10' : ''}`}
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          {selectedOption ? (
            <>
              <span className="truncate text-slate-800 dark:text-white uppercase leading-none">{selectedOption.label}</span>
              {selectedOption.subLabel && <span className="text-[10px] text-slate-400 uppercase opacity-60 leading-none">({selectedOption.subLabel})</span>}
            </>
          ) : (
            <span className="text-slate-400 uppercase leading-none">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] p-3 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              autoFocus
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Axtarın..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 pl-10 pr-4 text-[11px] font-black italic focus:ring-2 focus:ring-rose-500/10 uppercase outline-none"
            />
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:bg-rose-50 dark:hover:bg-rose-900/10 group ${value === opt.id ? 'bg-rose-50 dark:bg-rose-900/20' : ''}`}
                >
                  <div className="flex flex-col">
                    <span className={`text-[11px] font-black italic uppercase transition-colors leading-tight ${value === opt.id ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200 group-hover:text-rose-600'}`}>
                      {opt.label}
                    </span>
                    {opt.subLabel && <span className="text-[9px] text-slate-400 font-bold uppercase leading-tight mt-0.5">{opt.subLabel}</span>}
                  </div>
                  {value === opt.id && <Check className="w-3 h-3 text-rose-600" />}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-[10px] font-black text-slate-400 uppercase italic">Nəticə tapılmadı</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
