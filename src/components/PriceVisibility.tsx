import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { EyeOff } from 'lucide-react';

interface PriceVisibilityProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const PriceVisibility: React.FC<PriceVisibilityProps> = ({ children, fallback }) => {
  // In a real app, this would come from an Auth/Role context
  // For demonstration, we'll check a mock role in localStorage
  const userRole = localStorage.getItem('user_role') || 'ADMIN'; 
  
  const isWarehouseman = userRole === 'WAREHOUSE';

  if (isWarehouseman) {
    return (
      fallback || (
        <div className="flex items-center space-x-1 text-slate-300 italic">
          <EyeOff className="w-3 h-3" />
          <span className="text-[10px]">Gizli</span>
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default PriceVisibility;
