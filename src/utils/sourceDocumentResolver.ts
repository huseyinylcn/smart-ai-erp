import { 
  FileText, ShoppingCart, Landmark, 
  Package, Users, 
  FileCheck, type LucideIcon 
} from 'lucide-react';

export type SourceModule = 'SALES' | 'PURCHASE' | 'TREASURY' | 'INVENTORY' | 'PAYROLL' | 'SYSTEM';

export interface SourceDocumentInfo {
  route: string;
  label: string;
  icon: LucideIcon;
  id: string;
}

export const getSourceDocumentRoute = (module: string, type: string, id: string): string => {
  const t = type?.toUpperCase() || '';
  const m = module?.toUpperCase() || '';

  switch (m) {
    case 'SALES':
      if (t.includes('SAT') || t.includes('INVOICE')) return `/sales/invoice/${id}`;
      return `/sales/orders/${id}`;
    case 'PURCHASE':
      if (t.includes('ALIŞ') || t.includes('INVOICE') || t.includes('QAİMƏ')) return `/purchase/invoice/${id}`;
      if (t.includes('RECEIPT') || t.includes('MƏDAXİL')) return `/purchase/receipt/${id}`;
      return `/purchase/invoice/${id}`; // Fallback for purchase
    case 'TREASURY':
      if (t.includes('BANK')) return `/bank/payment/${id}`;
      if (t.includes('KASSA') || t.includes('CASH')) return `/bank/cash/disbursement/create`; // Using existing routes
      return `/finance/transaction/${id}`;
    case 'INVENTORY':
      if (t.includes('TRANSFER')) return `/inventory/transfer/${id}`;
      if (t.includes('ISSUE') || t.includes('XARİC')) return `/inventory/issue/${id}`;
      if (t.includes('ADJUSTMENT') || t.includes('DÜZƏLİŞ') || t.includes('RECEIPT')) return `/inventory/adjustment/${id}`;
      return `/inventory/moves`;
    case 'PAYROLL':
      return `/payroll/tables`;
    default:
      return '#';
  }
};

export const getSourceDocumentLabel = (type: string): string => {
  return type || 'Nümunə Sənəd';
};

export const getSourceDocumentIcon = (module: string): LucideIcon => {
  switch (module) {
    case 'SALES': return FileText;
    case 'PURCHASE': return ShoppingCart;
    case 'TREASURY': return Landmark;
    case 'INVENTORY': return Package;
    case 'PAYROLL': return Users;
    default: return FileCheck;
  }
};

export const getSourceDocumentStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'POSTED':
    case 'APPROVED': 
      return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    case 'DRAFT': 
      return 'bg-amber-50 text-amber-600 border-amber-100';
    case 'CANCELLED': 
    case 'REJECTED':
      return 'bg-rose-50 text-rose-600 border-rose-100';
    default: 
      return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};
