const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export const apiFetch = async (endpoint: string, options: RequestInit = {}, companyId?: string) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000); // 8 second timeout

  const headers = {
    'Content-Type': 'application/json',
    ...(companyId ? { 'X-Company-Id': companyId } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: any = new Error(errorData.error || `HTTP error! status: ${response.status}`);
      error.data = errorData;
      throw error;
    }

    return response.json();
  } catch (err: any) {
    clearTimeout(id);
    if (err.name === 'AbortError') {
      throw new Error('Server cavab vermir (Timeout)');
    }
    throw err;
  }
};

export const financeApi = {
  getTransactions: (params: any, companyId: string) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/finance/transactions?${query}`, {}, companyId);
  },
  getTransactionDetail: (id: string, companyId: string) => {
    return apiFetch(`/finance/transactions/${id}`, {}, companyId);
  },
  getAccounts: (companyId: string, params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/finance/accounts?${query}`, {}, companyId);
  },
  createAccount: (data: any, companyId: string) => {
    return apiFetch(`/finance/accounts`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updateAccount: (id: string, data: any, companyId: string) => {
    return apiFetch(`/finance/accounts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  deleteAccount: (id: string, companyId: string) => {
    return apiFetch(`/finance/accounts/${id}`, { method: 'DELETE' }, companyId);
  },
  checkAccountUsage: (id: string, companyId: string) => {
    return apiFetch(`/finance/accounts/${id}/usage`, {}, companyId);
  },
  createTransaction: (data: any, companyId: string) => {
    return apiFetch(`/finance/transactions`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  getExchangeRates: (companyId: string, params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/finance/exchange-rates?${query}`, {}, companyId);
  },
  syncExchangeRates: (companyId: string, date?: string) => {
    return apiFetch(`/finance/exchange-rates/sync`, { method: 'POST', body: JSON.stringify({ date }) }, companyId);
  },
  createManualRate: (data: any, companyId: string) => {
    return apiFetch(`/finance/exchange-rates/manual`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  toggleRateLock: (id: string, isLocked: boolean, companyId: string) => {
    return apiFetch(`/finance/exchange-rates/${id}/lock`, { method: 'PATCH', body: JSON.stringify({ isLocked }) }, companyId);
  },
  bulkLockRates: (ids: string[], isLocked: boolean, companyId: string) => {
    return apiFetch(`/finance/exchange-rates/bulk-lock`, { method: 'PATCH', body: JSON.stringify({ ids, isLocked }) }, companyId);
  },
  getCurrencies: (companyId: string) => {
    return apiFetch(`/finance/currencies`, {}, companyId);
  },
  createCurrency: (data: any, companyId: string) => {
    return apiFetch(`/finance/currencies`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updateCurrency: (id: string, data: any, companyId: string) => {
    return apiFetch(`/finance/currencies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  deleteCurrency: (id: string, companyId: string) => {
    return apiFetch(`/finance/currencies/${id}`, { method: 'DELETE' }, companyId);
  },
  getTreasuryCategories: (companyId: string) => {
    return apiFetch(`/finance/treasury-categories`, {}, companyId);
  },
  createTreasuryCategory: (data: any, companyId: string) => {
    return apiFetch(`/finance/treasury-categories`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updateTreasuryCategory: (id: string, data: any, companyId: string) => {
    return apiFetch(`/finance/treasury-categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  deleteTreasuryCategory: (id: string, companyId: string) => {
    return apiFetch(`/finance/treasury-categories/${id}`, { method: 'DELETE' }, companyId);
  }
};

export const companyApi = {
  getCompanies: () => apiFetch('/companies'),
  createCompany: (data: { code: string; name: string; taxId?: string }) => 
    apiFetch('/companies', { method: 'POST', body: JSON.stringify(data) }),
  updateCompany: (id: string, data: { name?: string; taxId?: string; isAccountPlanLocked?: boolean }) => 
    apiFetch(`/companies/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getBranches: (companyId: string) => 
    apiFetch(`/companies/${companyId}/branches`, {}, companyId),
};

export const crmApi = {
  getCounterparties: (companyId: string, type?: string) => {
    let url = `/crm/counterparties?companyId=${companyId}`;
    if (type) url += `&type=${type}`;
    return apiFetch(url);
  },
  getCounterparty: (id: string) => apiFetch(`/crm/counterparties/${id}`),
  createCounterparty: (data: { 
    companyId: string; 
    code: string; 
    name: string; 
    type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
    taxId?: string;
    isForeign?: boolean;
    isVatPayer?: boolean;
    payableAccountId?: string;
    advanceAccountId?: string;
    receivableAccountId?: string;
    bankAccounts?: any[];
  }) => apiFetch('/crm/counterparties', { method: 'POST', body: JSON.stringify(data) }),
  updateCounterparty: (id: string, data: any) => apiFetch(`/crm/counterparties/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCounterparty: (id: string) => apiFetch(`/crm/counterparties/${id}`, { method: 'DELETE' }),
};

export const salesApi = {
  getInvoices: (companyId: string) => apiFetch(`/sales/invoices?companyId=${companyId}`, {}, companyId),
  getOrders: (companyId: string) => apiFetch(`/sales/orders?companyId=${companyId}`, {}, companyId),
};

export const purchaseApi = {
  getInvoices: (companyId: string) => apiFetch(`/inventory/purchase-invoices?companyId=${companyId}`, {}, companyId),
  getOrders: (companyId: string) => apiFetch(`/inventory/purchase-orders?companyId=${companyId}`, {}, companyId),
};

export const hrApi = {
  getEmployees: (companyId: string) => {
    return apiFetch(`/hr/employees`, {}, companyId);
  },
  getEmployeeDetail: (id: string, companyId: string) => {
    return apiFetch(`/hr/employees/${id}`, {}, companyId);
  },
  updateEmployee: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/employees/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  deleteEmployee: (id: string, companyId: string) => {
    return apiFetch(`/hr/employees/${id}`, { method: 'DELETE' }, companyId);
  },
  bulkDeleteEmployees: (ids: string[], companyId: string) => {
    return apiFetch(`/hr/employees/bulk-delete`, { method: 'POST', body: JSON.stringify({ ids }) }, companyId);
  },
  hireEmployee: (data: any, companyId: string) => {
    return apiFetch(`/hr/hire`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  getHiringOrders: (companyId: string) => {
    return apiFetch(`/hr/hiring-orders`, {}, companyId);
  },
  getHiringOrderDetail: (id: string, companyId: string) => {
    return apiFetch(`/hr/hiring-orders/${id}`, {}, companyId);
  },
  updateHiringOrder: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/hiring-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }, companyId);
  },
  deleteHiringOrder: (id: string, companyId: string) => {
    return apiFetch(`/hr/hiring-orders/${id}`, { method: 'DELETE' }, companyId);
  },
  bulkDeleteHiringOrders: (ids: string[], companyId: string) => {
    return apiFetch(`/hr/hiring-orders/bulk-delete`, { method: 'POST', body: JSON.stringify({ ids }) }, companyId);
  },
  bulkUpdateHiringOrderAccounts: (data: { ids: string[], payableAccountId: string | null, advanceAccountId: string | null }, companyId: string) => {
    return apiFetch(`/hr/hiring-orders/bulk-accounts`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  getShifts: (companyId: string) => {
    return apiFetch(`/hr/shifts`, {}, companyId);
  },
  getCalendar: (year: number, companyId: string, workShiftId?: string) => {
    let url = `/hr/calendar?year=${year}`;
    if (workShiftId) url += `&workShiftId=${workShiftId}`;
    return apiFetch(url, {}, companyId);
  },
  getDepartments: (companyId: string) => {
    return apiFetch(`/hr/departments`, {}, companyId);
  },
  createDepartment: (data: any, companyId: string) => {
    return apiFetch(`/hr/departments`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updateDepartment: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/departments/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  deleteDepartment: (id: string, companyId: string) => {
    return apiFetch(`/hr/departments/${id}`, { method: 'DELETE' }, companyId);
  },
  createShift: (data: any, companyId: string) => {
    return apiFetch(`/hr/shifts`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updateShift: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/shifts/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  deleteShift: (id: string, companyId: string) => {
    return apiFetch(`/hr/shifts/${id}`, { method: 'DELETE' }, companyId);
  },
  toggleShiftStatus: (id: string, isActive: boolean, companyId: string) => {
    return apiFetch(`/hr/shifts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }, companyId);
  },
  reassignEmployees: (employeeIds: string[], newWorkShiftId: string, companyId: string) => {
    return apiFetch(`/hr/shifts/reassign`, { method: 'POST', body: JSON.stringify({ employeeIds, newWorkShiftId }) }, companyId);
  },
  getBranches: (companyId: string) => {
    return apiFetch(`/hr/branches`, {}, companyId);
  },
  createBranch: (data: any, companyId: string) => {
    return apiFetch(`/hr/branches`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updateBranch: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/branches/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  deleteBranch: (id: string, companyId: string) => {
    return apiFetch(`/hr/branches/${id}`, { method: 'DELETE' }, companyId);
  },
  amendContract: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/employees/${id}/amend`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  resetAttendance: (month: number, year: number, companyId: string, employeeIds?: string[]) => {
    return apiFetch(`/hr/attendance/reset`, { method: 'POST', body: JSON.stringify({ month, year, employeeIds }) }, companyId);
  },
  generateAttendance: (month: number, year: number, companyId: string, fill: boolean = false, employeeIds?: string[]) => {
    return apiFetch(`/hr/attendance/generate`, { method: 'POST', body: JSON.stringify({ month, year, fill, employeeIds }) }, companyId);
  },
  approveAttendance: (month: number, year: number, companyId: string, status: string, branchId?: string | string[], departmentId?: string | string[], attendanceIds?: string[]) => {
    return apiFetch(`/hr/attendance/approve`, { method: 'POST', body: JSON.stringify({ month, year, status, branchId, departmentId, attendanceIds }) }, companyId);
  },
  updateAttendanceDetail: (payload: { detailId: string; status: string; timeIn?: string; timeOut?: string; hoursWorked?: number }, companyId: string) => {
    return apiFetch(`/hr/attendance/cell`, { method: 'POST', body: JSON.stringify(payload) }, companyId);
  },
  batchUpdateAttendanceDetails: (updates: any[], companyId: string) => {
    return apiFetch(`/hr/attendance/batch-update`, { method: 'POST', body: JSON.stringify({ updates }) }, companyId);
  },
  resetPayroll: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/payroll/reset`, { method: 'POST', body: JSON.stringify({ month, year }) }, companyId);
  },
  generatePayroll: (month: number, year: number, companyId: string, data?: any) => {
    return apiFetch(`/hr/payroll/generate`, { 
      method: 'POST', 
      body: JSON.stringify({ month, year, ...data }) 
    }, companyId);
  },
  approvePayroll: (month: number, year: number, companyId: string, status: string) => {
    return apiFetch(`/hr/payroll/approve`, { method: 'POST', body: JSON.stringify({ month, year, status }) }, companyId);
  },
  getAttendanceStatus: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/attendance/status?month=${month}&year=${year}`, {}, companyId);
  },
  getPayrollStatus: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/payroll/status?month=${month}&year=${year}`, {}, companyId);
  },
  getPayrollMatrix: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/payroll/matrix?month=${month}&year=${year}`, {}, companyId);
  },
  savePayrollMatrix: (month: number, year: number, companyId: string, data: any) => {
    return apiFetch(`/hr/payroll/matrix`, {
      method: 'POST',
      body: JSON.stringify({ month, year, details: data.details || data })
    }, companyId);
  },
  terminateEmployee: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/employees/${id}/terminate`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  syncCalendar: (year: number, holidays: any[], companyId: string, workShiftId?: string) => {
    return apiFetch(`/hr/calendar/sync`, { method: 'POST', body: JSON.stringify({ year, holidays, workShiftId }) }, companyId);
  },
  registerAttendanceLog: (data: any, companyId: string) => {
    return apiFetch(`/hr/attendance/log`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  getAttendanceLogs: (companyId: string, employeeId?: string) => {
    let url = `/hr/attendance/logs`;
    if (employeeId) url += `?employeeId=${employeeId}`;
    return apiFetch(url, {}, companyId);
  },
  getTerminationOrders: (companyId: string) => {
    return apiFetch(`/hr/termination-orders`, {}, companyId);
  },
  deleteTerminationOrder: (id: string, companyId: string) => {
    return apiFetch(`/hr/termination-orders/${id}`, { method: 'DELETE' }, companyId);
  },
  bulkDeleteTerminationOrders: (ids: string[], companyId: string) => {
    return apiFetch(`/hr/termination-orders/bulk-delete`, { method: 'POST', body: JSON.stringify({ ids }) }, companyId);
  },
  getFaceGallery: (companyId: string) => {
    return apiFetch(`/hr/face-gallery`, {}, companyId);
  },
  registerFaceTemplate: (employeeId: string, templates: any[], companyId: string) => {
    return apiFetch(`/hr/employees/${employeeId}/face-registration`, { method: 'POST', body: JSON.stringify({ templates }) }, companyId);
  },
  deleteFaceTemplate: (employeeId: string, companyId: string) => {
    return apiFetch(`/hr/employees/${employeeId}/face-registration`, { method: 'DELETE' }, companyId);
  },
  initCalendar: (year: number, companyId: string, workShiftId?: string | null, month?: number | null) => {
    return apiFetch(`/hr/calendar/init`, { method: 'POST', body: JSON.stringify({ year, workShiftId, month }) }, companyId);
  },
  updateCalendarDay: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/calendar/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  updateCalendarBatch: (days: any[], companyId: string) => {
    return apiFetch(`/hr/calendar/batch-update`, { method: 'POST', body: JSON.stringify({ days }) }, companyId);
  },
  clearCalendar: (year: number, companyId: string, month?: number) =>
    apiFetch(`/hr/calendar/year/${year}${month !== undefined ? `?month=${month}` : ''}`, { method: 'DELETE' }, companyId),
  getMonthStatus: (month: number, year: number, companyId: string, workShiftId?: string) => {
    let url = `/hr/calendar/month-status?month=${month}&year=${year}`;
    if (workShiftId) url += `&workShiftId=${workShiftId}`;
    return apiFetch(url, { method: 'GET' }, companyId);
  },
  approveMonth: (year: number, month: number, status: string, companyId: string, workShiftId?: string) => {
    return apiFetch(`/hr/calendar/approve-month`, { method: 'POST', body: JSON.stringify({ year, month, status, workShiftId }) }, companyId);
  },

  // ENTERPRISE HR EXTENSIONS
  getPositions: (companyId: string) => {
    return apiFetch(`/hr/positions`, {}, companyId);
  },
  createPosition: (data: any, companyId: string) => {
    return apiFetch(`/hr/positions`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updatePosition: (id: string, data: any, companyId: string) => {
    return apiFetch(`/hr/positions/${id}`, { method: 'PATCH', body: JSON.stringify(data) }, companyId);
  },
  deletePosition: (id: string, companyId: string) => {
    return apiFetch(`/hr/positions/${id}`, { method: 'DELETE' }, companyId);
  },
  syncPositions: (companyId: string) => {
    return apiFetch(`/hr/positions/sync`, { method: 'POST' }, companyId);
  },
  getPermissions: (companyId: string) => {
    return apiFetch(`/hr/permissions`, {}, companyId);
  },
  createPermission: (data: any, companyId: string) => {
    return apiFetch(`/hr/permissions`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  getPermissionPolicies: (companyId: string) => {
    return apiFetch(`/hr/permission-policies`, {}, companyId);
  },
  createPermissionPolicy: (data: any, companyId: string) => {
    return apiFetch(`/hr/permission-policies`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updateAttendanceQuick: (employeeId: string, type: 'IN' | 'OUT', companyId: string) => {
    return apiFetch(`/hr/attendance/quick-update`, { method: 'POST', body: JSON.stringify({ employeeId, type }) }, companyId);
  },
  getAttendanceMatrix: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/attendance/matrix?month=${month}&year=${year}`, {}, companyId);
  },
  getLeaveRequests: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/leave-requests?month=${month}&year=${year}`, {}, companyId);
  },
  createLeaveRequest: (data: any, companyId: string) => {
    return apiFetch(`/hr/leave-requests`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  getEmployeeSettlements: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/settlements?month=${month}&year=${year}`, {}, companyId);
  },
  // BONUS & KPI
  getBonuses: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/bonuses?month=${month}&year=${year}`, {}, companyId);
  },
  saveBonuses: (bonuses: any[], month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/bonuses/batch`, { method: 'POST', body: JSON.stringify({ bonuses, month, year }) }, companyId);
  },
  getBonusStatus: (month: number, year: number, companyId: string) => {
    return apiFetch(`/hr/bonuses/status?month=${month}&year=${year}`, {}, companyId);
  },
  changeBonusStatus: (month: number, year: number, status: string, companyId: string) => {
    return apiFetch(`/hr/bonuses/status`, { method: 'POST', body: JSON.stringify({ month, year, status }) }, companyId);
  }
};

import { TENGRY_NOMENCLATURE, TENGRY_CATEGORIES } from './tengryData';

export const inventoryApi = {
  getCategories: (companyId: string) => apiFetch(`/inventory/categories`, {}, companyId),
  getItems: (params: { companyId: string, categoryId?: string, subCategoryId?: string, type?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiFetch(`/inventory/items?${query}`, {}, params.companyId);
  },
  createItem: (data: any, companyId: string) => {
    return apiFetch(`/inventory/items`, { method: 'POST', body: JSON.stringify(data) }, companyId);
  },
  updateItem: (id: string, data: any, companyId: string) => {
    return apiFetch(`/inventory/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }, companyId);
  },
  deleteItem: (id: string, companyId: string) => {
    return apiFetch(`/inventory/items/${id}`, { method: 'DELETE' }, companyId);
  },
  getNextCodes: (companyId: string) => apiFetch(`/inventory/next-codes?companyId=${companyId}`, {}, companyId),

  createCategory: async (_data: unknown, _companyId: string) => {
    console.warn('[inventoryApi] createCategory: demo — no persistence');
    return { ok: true as const };
  },
  updateCategory: async (_id: string, _data: unknown, _companyId: string) => {
    console.warn('[inventoryApi] updateCategory: demo — no persistence');
    return { ok: true as const };
  },
  deleteCategory: async (_id: string, _companyId: string) => {
    console.warn('[inventoryApi] deleteCategory: demo — no persistence');
    return { ok: true as const };
  },
  createSubCategory: async (_data: unknown, _companyId: string) => {
    console.warn('[inventoryApi] createSubCategory: demo — no persistence');
    return { ok: true as const };
  },
  updateSubCategory: async (_id: string, _data: unknown, _companyId: string) => {
    console.warn('[inventoryApi] updateSubCategory: demo — no persistence');
    return { ok: true as const };
  },
  deleteSubCategory: async (_id: string, _companyId: string) => {
    console.warn('[inventoryApi] deleteSubCategory: demo — no persistence');
    return { ok: true as const };
  },
};

export const authApi = {
  login: (data: any) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  registerCompany: (data: any) => apiFetch('/auth/register-company', { method: 'POST', body: JSON.stringify(data) }),
  inviteUser: (data: any, companyId: string) => apiFetch('/auth/invite-user', { method: 'POST', body: JSON.stringify(data) }, companyId),
  setPassword: (data: any) => apiFetch('/auth/set-password', { method: 'POST', body: JSON.stringify(data) }),
};
