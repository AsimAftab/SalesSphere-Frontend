import React, { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/* -------------------------
    LAYOUT & AUTH COMPONENTS
------------------------- */
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import { ModalProvider } from './components/modals/DemoModalContext';
import { ContactUsModalProvider } from './components/modals/ContactUsModalContext';

import ProtectedRoute from './components/auth/ProtectedRoutes';
import PermissionGate from './components/auth/PermissionGate';
import ProtectedLayout from './components/layout/ProtectedLayout/ProtectedLayout';
import AuthGate from './components/auth/AuthGate';
import SystemAdminGate from './components/auth/SystemAdminGate';

/* -------------------------
    PAGE SPINNER
------------------------- */
const PageSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />

    </div>
  </div>
);

/* -------------------------
    LAZY LOADED PAGES
------------------------- */
// Public
import Homepage from './Pages/HomePage/Homepage';
const LoginPage = React.lazy(() => import('./Pages/LoginPage/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./Pages/LoginPage/ForgetPassword'));
const ContactAdminPage = React.lazy(() => import('./Pages/LoginPage/ContactAdmin'));
const ResetPasswordPage = React.lazy(() => import('./Pages/LoginPage/ResetPassword'));
const NotFoundPage = React.lazy(() => import('./Pages/NotFoundPage/NotFoundPage'));

// Dashboard & Tracking
const DashboardPage = React.lazy(() => import('./Pages/DashboardPage/DashboardPage'));
const LiveTrackingPage = React.lazy(() => import('./Pages/LiveTrackingPage/LiveTrackingPage'));
const EmployeeTrackingDetailsPage = React.lazy(() => import('./Pages/LiveTrackingPage/EmployeeTrackingDetailsPage'));
const TrackingHistoryPage = React.lazy(() => import('./Pages/LiveTrackingPage/TrackingHistoryView'));

// Core Modules
const ProductPage = React.lazy(() => import('./Pages/ProductsPage/ProductsPage'));
const SalesManagementPage = React.lazy(() => import('./Pages/OrderListPage/SalesManagementPage'));
const CreateTransactionPage = React.lazy(() => import('./Pages/OrderListPage/CreateTransactionPage'));
const OrderDetailsPage = React.lazy(() => import('./Pages/OrderDetailsPage/OrderDetailsPage'));
const EstimateDetailsPage = React.lazy(() => import('./Pages/OrderDetailsPage/EstimateDetailPage'));

// Employee & Attendance
const EmployeesPage = React.lazy(() => import('./Pages/EmployeePage/EmployeesPage'));
const EmployeeDetailsPage = React.lazy(() => import('./Pages/EmployeeDetailsPage/EmployeeDetailsPage'));
const AttendancePage = React.lazy(() => import('./Pages/AttendancePage/AttendancePage'));
const LeavePage = React.lazy(() => import('./Pages/LeavePage/LeavePage'));

// Entities
const PartyPage = React.lazy(() => import('./Pages/Entities/PartyPage/PartyPage'));
const PartyDetailsPage = React.lazy(() => import('./Pages/Entities/PartyDetailPage/PartyDetailsPage'));
const ProspectPage = React.lazy(() => import('./Pages/Entities/ProspectPage/ProspectPage'));
const ProspectDetailsPage = React.lazy(() => import('./Pages/Entities/ProspectDetailPage/ProspectDetailsPage'));
const SitePage = React.lazy(() => import('./Pages/SitePage/SitePage'));
const SiteDetailsPage = React.lazy(() => import('./Pages/SiteDetailsPage/SiteDetailsPage'));

// Planning & Expenses
const AnalyticsPage = React.lazy(() => import('./Pages/AnalyticsPage/AnalyticsPage'));
const BeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/BeatPlanPage'));
const CreateBeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/CreateBeatPlanPage'));
const EditBeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/EditBeatPlanPage'));
const TourPlanPage = React.lazy(() => import('./Pages/TourPlanPage/TourPlanPage'));
const TourPlanDetailPage = React.lazy(() => import('./Pages/TourPlanDetailPage/TourPlanDetailPage'));
const ExpensesPage = React.lazy(() => import('./Pages/ExpensesPage/ExpensesPage'));
const ExpenseDetailPage = React.lazy(() => import('./Pages/ExpenseDetailPage/ExpenseDetailPage'));

// Admin & System
const SettingsPage = React.lazy(() => import('./Pages/SettingPage/SettingsPage'));
const AdminPanelPage = React.lazy(() => import('./Pages/AdminPanelPage/AdminPanelPage'));
const SuperAdminPage = React.lazy(() => import('./Pages/SuperAdmin/SuperAdminPage'));
const SystemUserProfilePage = React.lazy(() => import('./Pages/SystemUserProfilePage/SystemUserProfilePage'));

/* -------------------------
    LAYOUT WRAPPERS
------------------------- */
const PublicLayout = () => (
  <ModalProvider>
    <ContactUsModalProvider>
      <div className="bg-slate-900 text-white min-h-screen">
        <Navbar />
        <main><Outlet /></main>
        <Footer />
      </div>
    </ContactUsModalProvider>
  </ModalProvider>
);

/* -------------------------
    ROUTER CONFIG
------------------------- */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* PUBLIC ACCESS / AUTH GATEWAY 
            AuthGate prevents logged-in users from seeing '/login' */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Homepage />} />
        </Route>

        <Route element={<AuthGate />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/contact-admin" element={<ContactAdminPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* AUTHENTICATED CORE ROUTES 
            ProtectedRoute ensures user is logged in.
            AuthInitializationGuard in App.tsx ensures this check is stable. */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>

            {/* General Dashboard (Always available if authenticated) */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* LIVE TRACKING (Intersection Logic: Plan + Permissions) */}
            <Route element={<PermissionGate module="liveTracking" action="view" />}>
              <Route path="/live-tracking" element={<LiveTrackingPage />} />
              <Route path="/tracking-history" element={<TrackingHistoryPage />} />
              <Route path="/live-tracking/session/:sessionId" element={<EmployeeTrackingDetailsPage />} />
            </Route>

            {/* PRODUCTS */}
            <Route element={<PermissionGate module="products" action="view" />}>
              <Route path="/products" element={<ProductPage />} />
            </Route>

            {/* SALES & ORDERS */}
            <Route element={<PermissionGate module="orderLists" action="view" />}>
              <Route path="/order-lists" element={<SalesManagementPage />} />
              <Route path="/order/:orderId" element={<OrderDetailsPage />} />
              <Route path="/estimate/:estimateId" element={<EstimateDetailsPage />} />
              <Route path="/sales/create" element={<CreateTransactionPage />} />
            </Route>

            {/* EMPLOYEE MANAGEMENT */}
            <Route element={<PermissionGate module="employees" action="view" />}>
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
            </Route>

            {/* ATTENDANCE & LEAVES */}
            <Route element={<PermissionGate module="attendance" action="view" />}>
              <Route path="/attendance" element={<AttendancePage />} />
            </Route>
            <Route element={<PermissionGate module="leaves" action="view" />}>
              <Route path="/leaves" element={<LeavePage />} />
            </Route>

            {/* CRM / ENTITIES */}
            <Route element={<PermissionGate module="parties" action="view" />}>
              <Route path="/parties" element={<PartyPage />} />
              <Route path="/parties/:partyId" element={<PartyDetailsPage />} />
            </Route>
            <Route element={<PermissionGate module="prospects" action="view" />}>
              <Route path="/prospects" element={<ProspectPage />} />
              <Route path="/prospects/:prospectId" element={<ProspectDetailsPage />} />
            </Route>
            <Route element={<PermissionGate module="sites" action="view" />}>
              <Route path="/sites" element={<SitePage />} />
              <Route path="/sites/:siteId" element={<SiteDetailsPage />} />
            </Route>

            {/* ANALYTICS */}
            <Route element={<PermissionGate module="analytics" action="view" />}>
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>

            {/* PLANNING (BEAT & TOUR) */}
            <Route element={<PermissionGate module="beatPlan" action="view" />}>
              <Route path="/beat-plan" element={<BeatPlanPage />} />
              <Route path="/beat-plan/create" element={<CreateBeatPlanPage />} />
              <Route path="/beat-plan/edit/:planId" element={<EditBeatPlanPage />} />
            </Route>
            <Route element={<PermissionGate module="tourPlan" action="view" />}>
              <Route path="/tour-plan" element={<TourPlanPage />} />
              <Route path="/tour-plan/:id" element={<TourPlanDetailPage />} />
            </Route>

            {/* EXPENSES */}
            <Route element={<PermissionGate module="expenses" action="view" />}>
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/expenses/:id" element={<ExpenseDetailPage />} />
            </Route>

            {/* SETTINGS & ORG ADMIN PANEL */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route element={<PermissionGate module="settings" action="view" />}>
              <Route path="/admin-panel" element={<AdminPanelPage />} />
            </Route>

            {/* PLATFORM OWNER ROUTES (Restricted to Superadmin/Developer roles) */}
            <Route element={<SystemAdminGate />}>
              <Route path="/system-admin" element={<SuperAdminPage />} />
              <Route path="/system-admin/users/:userId" element={<SystemUserProfilePage />} />
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;