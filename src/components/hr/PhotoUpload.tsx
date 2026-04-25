import React, { useRef, useState } from 'react';
import { Camera, X, Loader2, ImagePlus } from 'lucide-react';

interface PhotoUploadProps {
  value?: string | null;
  onChange: (base64: string | null) => void;
  className?: string;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ value, onChange, className = '' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validation: Image type
    if (!file.type.startsWith('image/')) {
      setError('Yalnız şəkil faylları qəbul edilir');
      return;
    }

    // 2. Validation: Max Size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Fayl ölçüsü 2MB-dan çox olmamalıdır');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onChange(base64String);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('UPLOAD_ERROR:', err);
      setError('Yükləmə xətası baş verdi');
      setIsUploading(false);
    }
  };

  const clearPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`flex flex-col items-center space-y-3 ${className}`}>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="relative group cursor-pointer w-32 h-44 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all hover:border-emerald-400/50 hover:bg-slate-100 dark:hover:bg-slate-800 overflow-hidden"
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        ) : value ? (
          <>
            <img 
              src={value} 
              alt="Preview" 
              className="w-full h-full object-cover animate-in fade-in duration-500"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-8 h-8 text-white opacity-80" />
            </div>
            <button 
              onClick={clearPhoto}
              className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-lg text-rose-500 hover:text-rose-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-slate-300 dark:text-slate-600">
            <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Yüklə (3x4)</span>
          </div>
        )}
      </div>

      {error ? (
        <span className="text-[9px] font-bold text-rose-500 uppercase italic animate-in fade-in">{error}</span>
      ) : (
        <span className="text-[8px] font-black text-slate-300 uppercase italic tracking-widest">JPG, PNG (MAX 2MB)</span>
      )}

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
};

export default PhotoUpload;
