import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  rounded?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name, 
  size = 'md', 
  className = '',
  rounded = 'rounded-2xl'
}) => {
  // Get Initials
  const getInitials = (fullName: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-8 h-10.5 text-[10px]',
    sm: 'w-10 h-13.5 text-xs',
    md: 'w-16 h-21 text-base',
    lg: 'w-24 h-32 text-xl',
    xl: 'w-32 h-43 text-2xl'
  };

  const initials = getInitials(name);

  // 3:4 Aspect Ratio Container
  return (
    <div 
      className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-700/50 shadow-sm ${rounded} ${sizeClasses[size]} ${className}`}
      style={{ aspectRatio: '3 / 4' }}
    >
      {src ? (
        <img 
          src={src} 
          alt={name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = ''; // Fallback to initials on error
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-1">
          <span className="font-black italic uppercase tracking-tighter text-slate-400 dark:text-slate-500">
            {initials}
          </span>
          {size !== 'xs' && size !== 'sm' && (
            <User className="w-1/3 h-1/3 text-slate-300 dark:text-slate-600 opacity-50" />
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;
