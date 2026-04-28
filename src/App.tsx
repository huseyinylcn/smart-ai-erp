import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SalesInvoiceCreate from './pages/sales/SalesInvoiceCreate';
import { CompanyProvider } from './context/CompanyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Inventory from './pages/Inventory';
import Payroll from './pages/Payroll';
import Finance from './pages/Finance';
import Bank from './pages/Bank';
import Settings from './pages/Settings';
import POS from './pages/POS';
import CustomerCreate from './pages/crm/CustomerCreate';
import CustomerEdit from './pages/crm/CustomerEdit';
import CustomerDetail from './pages/crm/CustomerDetail';
import VendorCreate from './pages/crm/VendorCreate';
import VendorList from './pages/crm/VendorList';
import VendorEdit from './pages/crm/VendorEdit';
import VendorDetail from './pages/crm/VendorDetail';
import PurchaseInvoiceCreate from './pages/purchase/PurchaseInvoiceCreate';
import PurchaseOrderCreate from './pages/purchase/PurchaseOrderCreate';
import PurchaseOrderList from './pages/purchase/PurchaseOrderList';
import PurchaseReturnCreate from './pages/purchase/PurchaseReturnCreate';
import GoodsReceiptCreate from './pages/purchase/GoodsReceiptCreate';
import PurchaseRequisitionCreate from './pages/purchase/PurchaseRequisitionCreate';
import RequestForQuotationCreate from './pages/purchase/RequestForQuotationCreate';
import QuotationComparison from './pages/purchase/QuotationComparison';
import LandedCostCreate from './pages/purchase/LandedCostCreate';
import StockTransferCreate from './pages/inventory/StockTransferCreate';
import BankPaymentCreate from './pages/bank/BankPaymentCreate';
import BankRegistry from './pages/bank/BankRegistry';
import CashRegistry from './pages/bank/CashRegistry';
import DepositRegistry from './pages/bank/DepositRegistry';
import CashReceiptCreate from './pages/bank/CashReceiptCreate';
import CashDisbursementCreate from './pages/bank/CashDisbursementCreate';
import FinancialTransactionCreate from './pages/bank/FinancialTransactionCreate';
import ProformaInvoiceCreate from './pages/sales/ProformaInvoiceCreate';
import SalesReturnCreate from './pages/sales/SalesReturnCreate';
import StockIssueCreate from './pages/inventory/StockIssueCreate';
import InventoryCountCreate from './pages/inventory/InventoryCountCreate';
import ProductionOrderCreate from './pages/production/ProductionOrderCreate';
import MaterialIssueCreate from './pages/production/MaterialIssueCreate';
import ProductionOutputCreate from './pages/production/ProductionOutputCreate';
import CostCalculationCreate from './pages/production/CostCalculationCreate';
import BankTransactionCreate from './pages/finance/BankTransactionCreate';
import EmployeeCard from './pages/hr/EmployeeCard';
import ExpenseCreate from './pages/finance/ExpenseCreate';
import SalesOrderCreate from './pages/sales/SalesOrderCreate';
import SalesWaybillCreate from './pages/sales/SalesWaybillCreate';
import StockAdjustmentCreate from './pages/inventory/StockAdjustmentCreate';
import ConsignmentList from './pages/inventory/ConsignmentList';
import ConsignmentCreate from './pages/inventory/ConsignmentCreate';
import IncomeCreate from './pages/finance/IncomeCreate';
import CashTransactionCreate from './pages/finance/CashTransactionCreate';
import JournalEntryCreate from './pages/finance/JournalEntryCreate';
import ProductCreate from './pages/inventory/ProductCreate';
import ContractCreate from './pages/contracts/ContractCreate';
import CustomerList from './pages/crm/CustomerList';
import LeadList from './pages/crm/LeadList';
import SalesPipeline from './pages/crm/SalesPipeline';
import SalesList from './pages/sales/SalesList';
import SalesDashboard from './pages/sales/SalesDashboard';
import SalesOrderList from './pages/sales/SalesOrderList';
import SalesReturnList from './pages/sales/SalesReturnList';
import SalesReservationList from './pages/sales/SalesReservationList';
import SalesReservationCreate from './pages/sales/SalesReservationCreate';
import PriceList from './pages/sales/PriceList';
import PriceListCreate from './pages/sales/PriceListCreate';
import OpportunityList from './pages/crm/OpportunityList';
import TargetList from './pages/crm/TargetList';
import AssetCategories from './pages/assets/AssetCategories';
import AssetPurchaseCreate from './pages/assets/AssetPurchaseCreate';
import AssetCommissioningCreate from './pages/assets/AssetCommissioningCreate';
import AssetList from './pages/assets/AssetList';
import AssetDetail from './pages/assets/AssetDetail';
import LvaCategories from './pages/lva/LvaCategories';
import LvaList from './pages/lva/LvaList';
import LvaPurchaseCreate from './pages/lva/LvaPurchaseCreate';
import LvaIssueCreate from './pages/lva/LvaIssueCreate';
import WarehouseList from './pages/inventory/WarehouseList';
import StockMoves from './pages/inventory/StockMoves';
import Production from './pages/Production';
import BOMList from './pages/production/BOMList';
import BOMMasterCard from './pages/production/BOMMasterCard';
import ContractList from './pages/contracts/ContractList';
import ContractDetail from './pages/contracts/ContractDetail';
import PriceAgreementList from './pages/contracts/PriceAgreementList';
import PriceAgreementCreate from './pages/contracts/PriceAgreementCreate';
import PriceAgreementDetail from './pages/contracts/PriceAgreementDetail';
import Employees from './pages/hr/Employees';
import DepartmentList from './pages/hr/DepartmentList';
import PositionRegistry from './pages/hr/PositionRegistry';
import Attendance from './pages/hr/Attendance';
import AttendanceLogs from './pages/hr/AttendanceLogs';
import EmployeePermissions from './pages/hr/EmployeePermissions';
import SickLeaves from './pages/hr/SickLeaves';
import PayrollCalculationCreate from './pages/payroll/PayrollCalculationCreate';
import HiringOrderList from './pages/hr/HiringOrderList';
import EmployeeHiringCreate from './pages/hr/EmployeeHiringCreate';
import EmployeeTerminationCreate from './pages/hr/EmployeeTerminationCreate';
import TerminationRegistry from './pages/hr/TerminationRegistry';
import LeaveRequestCreate from './pages/hr/LeaveRequestCreate';
import ShiftManagement from './pages/hr/ShiftManagement';
import ProductionCalendar from './pages/hr/ProductionCalendar';
import BusinessTripCreate from './pages/hr/BusinessTripCreate';
import SickLeaveCreate from './pages/hr/SickLeaveCreate';
import PurchaseReceiptList from './pages/purchase/PurchaseReceiptList';
import PurchaseInvoiceList from './pages/purchase/PurchaseInvoiceList';
import PurchaseRequestList from './pages/purchase/PurchaseRequestList';
import PurchaseRequestCreate from './pages/purchase/PurchaseRequestCreate';
import PurchaseRequisitionList from './pages/purchase/PurchaseRequisitionList';
import RequestForQuotationList from './pages/purchase/RequestForQuotationList';
import PurchaseReturnWarehouseList from './pages/purchase/PurchaseReturnWarehouseList';
import PurchaseReturnInvoiceList from './pages/purchase/PurchaseReturnInvoiceList';
import Chat from './pages/apps/Chat';
import Calendar from './pages/apps/Calendar';
import Email from './pages/apps/Email';
import FileManager from './pages/apps/FileManager';
import Feed from './pages/apps/Feed';
import Booking from './pages/apps/Booking';
import Boards from './pages/apps/Boards';
import Collabs from './pages/apps/Collabs';
import ProjectDashboard from './pages/projects/ProjectDashboard';
import ProjectList from './pages/projects/ProjectList';
import KanbanBoard from './pages/projects/KanbanBoard';
import TaskList from './pages/projects/TaskList';
import GanttChart from './pages/projects/GanttChart';
import Workgroups from './pages/projects/Workgroups';
import CounterpartySettlements from './pages/finance/CounterpartySettlements';
import ArAging from './pages/finance/ArAging';
import ChartOfAccounts from './pages/finance/ChartOfAccounts';
import ApRegistry from './pages/finance/ApRegistry';
import LeaveRequestList from './pages/hr/LeaveRequestList';
import AttendancePortal from './pages/hr/AttendancePortal';
import FaceEnrollment from './pages/hr/FaceEnrollment';
import FaceRegistry from './pages/hr/FaceRegistry';
import { FormatProvider } from './context/FormatContext';
import NomenclatureList from './pages/inventory/NomenclatureList';
import StockAdjustmentList from './pages/inventory/StockAdjustmentList';
import ProductionJournal from './pages/production/ProductionJournal';
import AssetMaintenanceList from './pages/assets/AssetMaintenanceList';
import ExpenseRegistry from './pages/finance/ExpenseRegistry';
import PayrollTable from './pages/payroll/PayrollTable';
import PayrollCalculator from './pages/payroll/PayrollCalculator';
import KpiList from './pages/payroll/KpiList';
import BonusList from './pages/payroll/BonusList';
import TrialBalance from './pages/reports/TrialBalance';
import SAIAgent from './pages/ai/SAIAgent';
import JournalEntryList from './pages/finance/JournalEntryList';
import GeneralLedger from './pages/finance/GeneralLedger';
import Tax from './pages/Tax';
import CurrencyList from './pages/finance/CurrencyList';
import CurrencyConversion from './pages/finance/CurrencyConversion';
import FxGainLossReport from './pages/reports/FxGainLossReport';
import CurrencyRevaluation from './pages/finance/CurrencyRevaluation';
import ProfitAndLoss from './pages/finance/reports/ProfitAndLoss';
import BalanceSheet from './pages/finance/reports/BalanceSheet';
import CashFlow from './pages/finance/reports/CashFlow';
import TransactionDetail from './pages/finance/TransactionDetail';
import CompanyManagement from './pages/settings/CompanyManagement';
import QuickActionsSettings from './pages/settings/QuickActionsSettings';
import Users from './pages/Users';
import RolesPermissions from './pages/RolesPermissions';
import Automation from './pages/ai/Automation';
import IndustryInsights from './pages/ai/IndustryInsights';
import ERPSetupAssistant from './pages/ai/ERPSetupAssistant';
import Roadmap from './pages/ai/Roadmap';
import LearningLab from './pages/ai/LearningLab';
import ReportCenter from './pages/ai/ReportCenter';
import BitrixAnalysis from './pages/ai/BitrixAnalysis';
import OneCAnalysis from './pages/ai/OneCAnalysis';
import EcomAnalysis from './pages/ai/EcomAnalysis';
import ProjectAnalysis from './pages/ai/ProjectAnalysis';
import AppAnalysis from './pages/ai/AppAnalysis';
import SystemAnalysis from './pages/ai/SystemAnalysis';
import ComplianceHub from './pages/ai/ComplianceHub';
import GovernmentIntegrations from './pages/ai/GovernmentIntegrations';
import AIAgentAssistant from './pages/ai/AIAgentAssistant';
import AIDashboardCreator from './pages/ai/AIDashboardCreator';
import SiteRegistry from './pages/web/SiteRegistry';
import OnlineStores from './pages/web/OnlineStores';
import WebCatalog from './pages/web/WebCatalog';
import WebOrders from './pages/web/WebOrders';
import WebAnalytics from './pages/web/WebAnalytics';
import WebSettings from './pages/web/WebSettings';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResetPassword from './pages/auth/ResetPassword';
import ForgotPassword from './pages/auth/ForgotPassword';
import AboutUs from './pages/landing/AboutUs';
import FAQPage from './pages/landing/FAQ';
import Blog from './pages/landing/Blog';
import Training from './pages/landing/Training';
import TransfersAndExchange from './pages/bank/TransfersAndExchange';
import BalanceTurnoverReport from './pages/bank/BalanceTurnoverReport';
import BankSettings from './pages/bank/BankSettings';
import { useEffect } from 'react';

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex h-full items-center justify-center p-6 text-center animate-in fade-in duration-500">
    <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-100 max-w-xl">
      <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-inner">
        AZ
      </div>
      <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
      <p className="text-slate-500 mt-4 leading-relaxed font-medium">Bu baza modulu üzrə Data Strukturu (SQL Backend) və UI İnteqrasiyası <b>Mərhələ 3</b>-də aktivləşdiriləcək.</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/landing" replace />;
  return <>{children}</>;
};

import { LocalizationProvider } from './context/LocalizationContext';

function App() {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <CompanyProvider>
          <FormatProvider>
            <BrowserRouter>
              <Routes>
                {/* PUBLIC LANDING ROUTES */}
                <Route path="/landing" element={<Landing />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/training" element={<Training />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/reset-password" element={<ResetPassword />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                {/* PROTECTED APP ROUTES */}
                <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Dashboard />} />
            <Route path="sales" element={<SalesDashboard />} />
            <Route path="sales/dashboard" element={<SalesDashboard />} />
            <Route path="sales/list" element={<SalesList />} />
            <Route path="sales/orders" element={<SalesOrderList />} />
            <Route path="sales/order/create" element={<SalesOrderCreate />} />
            <Route path="sales/pricelist" element={<PriceList />} />
            <Route path="sales/pricelist/create" element={<PriceListCreate />} />
            <Route path="sales/waybill/create" element={<SalesWaybillCreate />} />
            <Route path="sales/invoice/create" element={<SalesInvoiceCreate />} />
            <Route path="sales/proforma/create" element={<ProformaInvoiceCreate />} />
            <Route path="sales/returns" element={<SalesReturnList />} />
            <Route path="sales/return/create" element={<SalesReturnCreate />} />
            <Route path="sales/reservations" element={<SalesReservationList />} />
            <Route path="sales/reservations/create" element={<SalesReservationCreate />} />

            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/transfer/create" element={<StockTransferCreate />} />
            <Route path="inventory/transfer/:id" element={<StockTransferCreate />} />
            <Route path="inventory/adjustment/create" element={<StockAdjustmentCreate />} />
            <Route path="inventory/adjustment/:id" element={<StockAdjustmentCreate />} />
            <Route path="inventory/issue/create" element={<StockIssueCreate />} />
            <Route path="inventory/issue/:id" element={<StockIssueCreate />} />
            <Route path="inventory/count/create" element={<InventoryCountCreate />} />
            <Route path="inventory/adjustments" element={<StockAdjustmentList />} />
            <Route path="inventory/consignment" element={<ConsignmentList />} />
            <Route path="inventory/consignment/create" element={<ConsignmentCreate />} />
            <Route path="inventory/warehouses" element={<WarehouseList />} />
            <Route path="inventory/moves" element={<StockMoves />} />
            <Route path="inventory/nomenclature" element={<NomenclatureList />} />
            <Route path="inventory/products/create" element={<ProductCreate />} />


            <Route path="purchase/invoice/create" element={<PurchaseInvoiceCreate />} />
            <Route path="purchase/invoice/list" element={<PurchaseInvoiceList />} />
            <Route path="purchase/invoice/:id" element={<PurchaseInvoiceCreate />} />
            <Route path="purchase/order/create" element={<PurchaseOrderCreate />} />
            <Route path="purchase/orders" element={<PurchaseOrderList />} />
            <Route path="purchase/return/warehouse/list" element={<PurchaseReturnWarehouseList />} />
            <Route path="purchase/return/warehouse/create" element={<PurchaseReturnCreate />} />
            <Route path="purchase/return/invoice/list" element={<PurchaseReturnInvoiceList />} />
            <Route path="purchase/return/invoice/create" element={<Placeholder title="Alınmış malların geriyə qaytarılması E-qaiməsi" />} />
            <Route path="purchase/receipt/list" element={<PurchaseReceiptList />} />
            <Route path="purchase/receipt/create" element={<GoodsReceiptCreate />} />
            <Route path="purchase/receipt/:id" element={<GoodsReceiptCreate />} />
            <Route path="purchase/requests" element={<PurchaseRequestList />} />
            <Route path="purchase/requests/create" element={<PurchaseRequestCreate />} />
            <Route path="purchase/requisitions" element={<PurchaseRequisitionList />} />
            <Route path="purchase/requisitions/create" element={<PurchaseRequisitionCreate />} />
            <Route path="purchase/rfq" element={<RequestForQuotationList />} />
            <Route path="purchase/rfq/create" element={<RequestForQuotationCreate />} />
            <Route path="purchase/quotations/comparison" element={<QuotationComparison />} />
            <Route path="purchase/landed-cost" element={<Placeholder title="Maya Dəyəri Əlavələri Reyestri" />} />
            <Route path="purchase/landed-cost/create" element={<LandedCostCreate />} />
            <Route path="purchase/vendors" element={<VendorList />} />
            <Route path="purchase/vendors/create" element={<VendorCreate />} />
            <Route path="purchase/vendors/edit/:id" element={<VendorEdit />} />
            <Route path="purchase/vendors/detail/:id" element={<VendorDetail />} />

            <Route path="production" element={<Production />} />
            <Route path="production/journal" element={<ProductionJournal />} />
            <Route path="production/bom" element={<BOMList />} />
            <Route path="production/bom/create" element={<BOMMasterCard />} />
            <Route path="production/bom/:id" element={<BOMMasterCard />} />
            <Route path="production/order/create" element={<ProductionOrderCreate />} />
            <Route path="production/material-issue/create" element={<MaterialIssueCreate />} />
            <Route path="production/output/create" element={<ProductionOutputCreate />} />
            <Route path="production/cost-calculation/create" element={<CostCalculationCreate />} />

            <Route path="finance/income/create" element={<IncomeCreate />} />
            <Route path="finance/expense/create" element={<ExpenseCreate />} />
            <Route path="finance/bank-transaction/create" element={<BankTransactionCreate />} />
            <Route path="finance/cash/create" element={<CashTransactionCreate />} />
            <Route path="finance/journal/create" element={<JournalEntryCreate />} />
            <Route path="finance" element={<Finance />} />
            <Route path="finance/chart-of-accounts" element={<ChartOfAccounts />} />
            <Route path="finance/journal/list" element={<JournalEntryList />} />
            <Route path="finance/general-ledger" element={<GeneralLedger />} />
            <Route path="finance/trial-balance" element={<TrialBalance />} />
            <Route path="finance/settlements" element={<CounterpartySettlements />} />
            <Route path="finance/ar-aging" element={<ArAging />} />
            <Route path="finance/ap-registry" element={<ApRegistry />} />
            <Route path="finance/expenses" element={<ExpenseRegistry />} />
            <Route path="finance/currencies" element={<CurrencyList />} />
            <Route path="finance/currency-conversion" element={<CurrencyConversion />} />
            <Route path="finance/fx-report" element={<FxGainLossReport />} />
            <Route path="finance/currency-revaluation" element={<CurrencyRevaluation />} />
            <Route path="finance/profit-and-loss" element={<ProfitAndLoss />} />
            <Route path="finance/balance-sheet" element={<BalanceSheet />} />
            <Route path="finance/cash-flow" element={<CashFlow />} />
            <Route path="finance/transaction/:id" element={<TransactionDetail />} />

            <Route path="hr/employees" element={<Employees />} />
            <Route path="hr/departments" element={<DepartmentList />} />
            <Route path="hr/positions" element={<PositionRegistry />} />
            <Route path="hr/shifts" element={<ShiftManagement />} />
            <Route path="hr/calendar" element={<ProductionCalendar />} />
            <Route path="hr/attendance" element={<Attendance />} />
            <Route path="hr/attendance-log" element={<AttendanceLogs />} />
            <Route path="hr/permissions" element={<EmployeePermissions />} />
            <Route path="hr/sick-leaves" element={<SickLeaves />} />
            <Route path="hr/hiring" element={<HiringOrderList />} />
            <Route path="hr/hiring/create" element={<EmployeeHiringCreate />} />
            <Route path="hr/hiring/edit/:id" element={<EmployeeHiringCreate />} />
            <Route path="hr/terminations" element={<TerminationRegistry />} />
            <Route path="hr/termination/create" element={<EmployeeTerminationCreate />} />
            <Route path="hr/leaves/create" element={<LeaveRequestCreate />} />
            <Route path="hr/sick-leave/create" element={<SickLeaveCreate />} />
            <Route path="hr/business-trip/create" element={<BusinessTripCreate />} />
            <Route path="hr/employee/:id" element={<EmployeeCard />} />
            <Route path="hr/leaves" element={<LeaveRequestList />} />
            <Route path="hr/face-registry" element={<FaceRegistry />} />
            
            <Route path="payroll/calculation/create" element={<PayrollCalculationCreate />} />
            <Route path="payroll/tables" element={<PayrollTable />} />
            <Route path="payroll/calculator" element={<PayrollCalculator />} />
            <Route path="payroll/kpi" element={<KpiList />} />
            <Route path="payroll/bonus" element={<BonusList />} />
            <Route path="payroll" element={<Payroll />} />

            <Route path="assets" element={<AssetList />} />
            <Route path="assets/maintenance" element={<AssetMaintenanceList />} />
            <Route path="assets/purchase/create" element={<AssetPurchaseCreate />} />
            <Route path="assets/commissioning/create" element={<AssetCommissioningCreate />} />
            <Route path="assets/categories" element={<AssetCategories />} />
            <Route path="assets/detail/:id" element={<AssetDetail />} />

            <Route path="lva" element={<LvaList />} />
            <Route path="lva/purchase/create" element={<LvaPurchaseCreate />} />
            <Route path="lva/issue/create" element={<LvaIssueCreate />} />
            <Route path="lva/categories" element={<LvaCategories />} />

            <Route path="bank" element={<Bank />} />
            <Route path="bank/registry" element={<BankRegistry />} />
            <Route path="bank/cash" element={<CashRegistry />} />
            <Route path="bank/deposits" element={<DepositRegistry />} />
            <Route path="bank/customs" element={<DepositRegistry />} />
            <Route path="bank/vat-deposit" element={<DepositRegistry />} />
            <Route path="bank/shv-tax" element={<DepositRegistry />} />
            <Route path="bank/shv-social" element={<DepositRegistry />} />
            <Route path="bank/transactions" element={<Bank />} />
            <Route path="bank/transfers" element={<TransfersAndExchange />} />
            <Route path="bank/exchange" element={<TransfersAndExchange />} />
            <Route path="finance/currencies" element={<CurrencyList />} />
            <Route path="bank/reports" element={<BalanceTurnoverReport />} />
            <Route path="bank/settings" element={<BankSettings />} />
            <Route path="bank/cash/receipt/create" element={<CashReceiptCreate />} />
            <Route path="bank/cash/disbursement/create" element={<CashDisbursementCreate />} />
            <Route path="bank/payment/create" element={<BankPaymentCreate />} />
            <Route path="bank/transactions/create" element={<FinancialTransactionCreate />} />

            <Route path="contracts" element={<ContractList />} />
            <Route path="contracts/create" element={<ContractCreate />} />
            <Route path="contracts/edit/:id" element={<ContractCreate />} />
            <Route path="contracts/detail/:id" element={<ContractDetail />} />
            <Route path="contracts/price-agreements" element={<PriceAgreementList />} />
            <Route path="contracts/price-agreements/create" element={<PriceAgreementCreate />} />
            <Route path="contracts/price-agreements/edit/:id" element={<PriceAgreementCreate />} />
            <Route path="contracts/price-agreements/detail/:id" element={<PriceAgreementDetail />} />

            <Route path="crm/customers" element={<CustomerList />} />
            <Route path="crm/customers/create" element={<CustomerCreate />} />
            <Route path="crm/customers/edit/:id" element={<CustomerEdit />} />
            <Route path="crm/customers/detail/:id" element={<CustomerDetail />} />
            <Route path="crm/leads" element={<LeadList />} />
            <Route path="crm/opportunities" element={<OpportunityList />} />
            <Route path="crm/pipeline" element={<SalesPipeline />} />
            <Route path="crm/targets" element={<TargetList />} />
            <Route path="crm/vendors" element={<VendorList />} />
            <Route path="crm/vendors/create" element={<VendorCreate />} />
            <Route path="crm/vendors/edit/:id" element={<VendorEdit />} />
            <Route path="crm/vendors/detail/:id" element={<VendorDetail />} />

            <Route path="tax" element={<Tax />} />
            <Route path="settings" element={<Settings />} />
            <Route path="settings/companies" element={<CompanyManagement />} />
            <Route path="settings/quick-actions" element={<QuickActionsSettings />} />
            <Route path="users" element={<Users />} />
            <Route path="roles-permissions" element={<RolesPermissions />} />
            
            <Route path="app/chat" element={<Chat />} />
            <Route path="app/calendar" element={<Calendar />} />
            <Route path="app/email" element={<Email />} />
            <Route path="app/files" element={<FileManager />} />
            <Route path="app/feed" element={<Feed />} />
            <Route path="app/booking" element={<Booking />} />
            <Route path="app/boards" element={<Boards />} />
            <Route path="app/collabs" element={<Collabs />} />
            
            <Route path="projects/dashboard" element={<ProjectDashboard />} />
            <Route path="projects/list" element={<ProjectList />} />
            <Route path="projects/kanban" element={<KanbanBoard />} />
            <Route path="projects/tasks" element={<TaskList />} />
            <Route path="projects/gantt" element={<GanttChart />} />
            <Route path="projects/workgroups" element={<Workgroups />} />
            <Route path="ai-agent" element={<SAIAgent />} />
            <Route path="ai/automation" element={<Automation />} />
            <Route path="ai/roadmap" element={<Roadmap />} />
            <Route path="ai/learning-lab" element={<LearningLab />} />
            <Route path="ai/industry-insights" element={<IndustryInsights />} />
            <Route path="ai/setup-assistant" element={<ERPSetupAssistant />} />
            <Route path="ai/report-center" element={<ReportCenter />} />
            <Route path="ai/bitrix-analysis" element={<BitrixAnalysis />} />
            <Route path="ai/1c-analysis" element={<OneCAnalysis />} />
            <Route path="ai/ecom-analysis" element={<EcomAnalysis />} />
            <Route path="ai/project-analysis" element={<ProjectAnalysis />} />
            <Route path="ai/app-analysis" element={<AppAnalysis />} />
            <Route path="ai/system-analysis" element={<SystemAnalysis />} />
            <Route path="ai/compliance-hub" element={<ComplianceHub />} />
            <Route path="ai/gov-integrations" element={<GovernmentIntegrations />} />
            
            {/* ERP Admin Panel AI Agents */}
            <Route path="ai/dev-assistant" element={<AIAgentAssistant title="Aİ İnkişaf Köməkçisi" subtitle="Sistem İnkişafı və UX Optimallaşdırılması" type="dev" />} />
            <Route path="ai/template-builder" element={<AIAgentAssistant title="Aİ Şablon Qurucu" subtitle="Dinamik Sənəd və Hesabat Şablonları" type="template" />} />
            <Route path="ai/strategic-advisor" element={<AIAgentAssistant title="Aİ Strateji Məsləhətçi" subtitle="Biznes Böyüməsi və Strateji Analiz" type="strategic" />} />
            <Route path="ai/translation-advisor" element={<AIAgentAssistant title="Aİ Tərcümə Məsləhətçisi" subtitle="Sistem Lokalizasiya və Dil Strategiyası" type="strategic" />} />
            <Route path="ai/admin-assistant" element={<AIAgentAssistant title="Aİ Admin Köməkçisi" subtitle="Sistem Nizamlamaları və İstifadəçi İdarəetməsi" type="strategic" />} />
            <Route path="ai/admin-analysis" element={<AIAgentAssistant title="Aİ Admin Analizi" subtitle="Admin Nizamlamaları və Səlahiyyət Təklifləri" type="admin" />} />

            <Route path="ai/dashboard-creator" element={<AIDashboardCreator />} />
            
            <Route path="web/sites" element={<SiteRegistry />} />
            <Route path="web/stores" element={<OnlineStores />} />
            <Route path="web/catalog" element={<WebCatalog />} />
            <Route path="web/orders" element={<WebOrders />} />
            <Route path="web/analytics" element={<WebAnalytics />} />
            <Route path="web/settings" element={<WebSettings />} />

            <Route path="hr/attendance-portal" element={<AttendancePortal />} />
            <Route path="hr/face-enrollment" element={<FaceEnrollment />} />
          </Route>
          
          <Route path="pos" element={<POS />} />
            <Route path="attendance-portal" element={<AttendancePortal />} />
            <Route path="face-enrollment" element={<FaceEnrollment />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </BrowserRouter>
        </FormatProvider>
      </CompanyProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}

export default App;
