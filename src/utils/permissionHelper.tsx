import { 
  Lock, 
  AlertCircle
} from 'lucide-react';

export type ERPModule = 'SALES' | 'PURCHASE' | 'TREASURY' | 'INVENTORY' | 'PAYROLL' | 'FINANCE' | 'HR' | 'SYSTEM';

export interface ModulePermissions {
  view: boolean;
  edit: boolean;
  create: boolean;
  delete: boolean;
}

// Mock system permissions - in a real app this would come from an AuthProvider/Redux
export const mockUser = {
  id: 'USR-001',
  name: 'Anar Əliyev',
  role: 'Accountant',
  permissions: {
    SALES: { view: true, edit: false, create: false, delete: false },
    PURCHASE: { view: true, edit: false, create: false, delete: false },
    TREASURY: { view: true, edit: true, create: true, delete: false },
    INVENTORY: { view: true, edit: false, create: false, delete: false },
    PAYROLL: { view: false, edit: false, create: false, delete: false }, // RESTRICTED
    FINANCE: { view: true, edit: true, create: true, delete: false },
    HR: { view: false, edit: false, create: false, delete: false },
    SYSTEM: { view: true, edit: false, create: false, delete: false },
  } as Record<ERPModule, ModulePermissions>
};

/**
 * Checks if the current user has permission for a specific module and action.
 */
export const hasPermission = (module: string | ERPModule, action: keyof ModulePermissions = 'view'): boolean => {
  const m = (module?.toUpperCase() || '') as ERPModule;
  const perms = mockUser.permissions[m];
  if (!perms) return false;
  return perms[action];
};

/**
 * Checks if financial data (prices, amounts) should be hidden for the current user.
 * Role: Warehouse manager/worker should NOT see prices.
 */
export const shouldHidePrices = (): boolean => {
  return mockUser.role === 'Warehouse Manager' || mockUser.role === 'Warehouse Worker';
};

/**
 * Returns a standardized warning component for restricted access.
 */
export const PermissionDeniedBanner = ({ moduleName }: { moduleName: string }) => {
  return (
    <div className="p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-3xl flex items-start space-x-4">
      <div className="p-3 bg-rose-100 dark:bg-rose-800 rounded-2xl text-rose-600">
        <Lock className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-black text-rose-800 dark:text-rose-200 uppercase tracking-widest italic">Giriş Məhdudlaşdırılıb</h4>
        <p className="text-xs font-bold text-rose-600/70 mt-1 uppercase tracking-tight italic">
          Sizin "{moduleName}" moduluna giriş icazəniz yoxdur. Zəhmət olmasa administratorla əlaqə saxlayın.
        </p>
      </div>
    </div>
  );
};

/**
 * Returns a warning banner for legacy or missing source documents.
 */
export const LegacySourceWarning = ({ reason }: { reason: string }) => {
  return (
    <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-center space-x-3 text-amber-700 dark:text-amber-300">
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-[10px] font-black uppercase tracking-widest italic">{reason}</span>
    </div>
  );
};
