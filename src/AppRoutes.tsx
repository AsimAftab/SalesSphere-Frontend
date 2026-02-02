import React, { Suspense } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
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
import SuperAdminLayout from './components/layout/SuperAdminLayout/SuperAdminLayout';

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
import Homepage from './pages/HomePage/Homepage';
const LoginPage = React.lazy(() => import('./pages/LoginPage/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/LoginPage/ForgetPassword'));
const ContactAdminPage = React.lazy(() => import('./pages/LoginPage/ContactAdmin'));
const ResetPasswordPage = React.lazy(() => import('./pages/LoginPage/ResetPassword'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage/NotFoundPage'));

// Dashboard & Tracking
const DashboardPage = React.lazy(() => import('./pages/DashboardPage/DashboardPage'));
const LiveTrackingPage = React.lazy(() => import('./pages/LiveTrackingPage/LiveTrackingPage'));
const EmployeeTrackingDetailsPage = React.lazy(() => import('./pages/LiveTrackingPage/tabs/EmployeeTracking/SessionDetails/EmployeeTrackingDetailsPage'));

// Core Modules
const ProductPage = React.lazy(() => import('./pages/ProductsPage/ProductsPage'));
const SalesManagementPage = React.lazy(() => import('./pages/OrderListPage/SalesManagementPage'));
const CreateTransactionPage = React.lazy(() => import('./pages/OrderListPage/Transaction/CreateTransactionPage'));
const OrderDetailsPage = React.lazy(() => import('./pages/OrderDetailsPage/Order/OrderDetailsPage'));
const EstimateDetailsPage = React.lazy(() => import('./pages/OrderDetailsPage/Estimate/EstimateDetailsPage'));

// Employee & Attendance
const EmployeesPage = React.lazy(() => import('./pages/EmployeePage/EmployeesPage'));
const EmployeeDetailsPage = React.lazy(() => import('./pages/EmployeeDetailsPage/EmployeeDetailsPage'));
const AttendancePage = React.lazy(() => import('./pages/AttendancePage/AttendancePage'));
const LeavePage = React.lazy(() => import('./pages/LeavePage/LeavePage'));

// Entities
const PartyPage = React.lazy(() => import('./pages/Entities/PartyPage/PartyPage'));
const PartyDetailsPage = React.lazy(() => import('./pages/Entities/PartyDetailPage/PartyDetailsPage'));
const ProspectPage = React.lazy(() => import('./pages/Entities/ProspectPage/ProspectPage'));
const ProspectDetailsPage = React.lazy(() => import('./pages/Entities/ProspectDetailPage/ProspectDetailsPage'));
const SitePage = React.lazy(() => import('./pages/Entities/SitePage/SitePage'));
const SiteDetailsPage = React.lazy(() => import('./pages/Entities/SiteDetailPage/SiteDetailPage'));

// Planning, Expenses & Collection
const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage/AnalyticsPage'));
const BeatPlanPage = React.lazy(() => import('./pages/BeatPlanPage/BeatPlanPage'));
const TourPlanPage = React.lazy(() => import('./pages/TourPlanPage/TourPlanPage'));
const TourPlanDetailPage = React.lazy(() => import('./pages/TourPlanDetailPage/TourPlanDetailPage'));
const ExpensesPage = React.lazy(() => import('./pages/ExpensesPage/ExpensesPage'));
const ExpenseDetailPage = React.lazy(() => import('./pages/ExpenseDetailPage/ExpenseDetailPage'));
const CollectionPage = React.lazy(() => import('./pages/CollectionPage/CollectionPage'));
const CollectionDetailsPage = React.lazy(() => import('./pages/CollectionDetailsPage/CollectionDetailsPage'));

// Notes, Miscellaneous Work & Odometer
const NotesPage = React.lazy(() => import('./pages/NotesPage/NotesPage'));
const NotesDetailPage = React.lazy(() => import('./pages/NotesDetailPage/NotesDetailPage'));
const MiscellaneousWorkPage = React.lazy(() => import('./pages/MiscellaneousWorkPage/MiscellaneousWorkPage'));
const OdometerRecordsPage = React.lazy(() => import('./pages/Odometer/OdometerRecordsPage/OdometerRecordsPage'));
const OdometerDetailsPage = React.lazy(() => import('./pages/Odometer/OdometerDetailsPage/OdometerDetailsPage'));
const TripDetailsPage = React.lazy(() => import('./pages/Odometer/TripDetailsPage/TripDetailsPage'));

// Admin & System
const SettingsPage = React.lazy(() => import('./pages/SettingPage/SettingsPage'));
const AdminPanelPage = React.lazy(() => import('./pages/AdminPanelPage/AdminPanelPage'));
const SystemUserProfilePage = React.lazy(() => import('./pages/SystemUserProfilePage/SystemUserProfilePage'));
const Dashboard = React.lazy(() => import('./pages/SuperAdmin/dashboard/Dashboard'));
const OrganizationListPage = React.lazy(() => import('./pages/SuperAdmin/organizations/OrganizationListPage/OrganizationListPage'));
const OrganizationDetailPage = React.lazy(() => import('./pages/SuperAdmin/organizations/OrganizationDetailPage/OrganizationDetailPage'));
const SubscriptionPlansPage = React.lazy(() => import('./pages/SuperAdmin/plans/SubscriptionPlansPage'));
const SystemUserListPage = React.lazy(() => import('./pages/SuperAdmin/users/SystemUserListPage'));
const ActivityLogsPage = React.lazy(() => import('./pages/SuperAdmin/activityLogs/ActivityLogsPage'));
const SuperAdminSecurityPage = React.lazy(() => import('./pages/SuperAdmin/security/SuperAdminSecurityPage'));
const SuperAdminNotificationsPage = React.lazy(() => import('./pages/SuperAdmin/notifications/SuperAdminNotificationsPage'));
const SuperAdminSettingsPage = React.lazy(() => import('./pages/SuperAdmin/settings/SuperAdminSettingsPage'));

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

            {/* Dashboard (Permission-gated) */}
            <Route element={<PermissionGate module="dashboard" feature="viewStats" />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            {/* LIVE TRACKING (Intersection Logic: Plan + Permissions) */}
            <Route element={<PermissionGate module="liveTracking" feature="viewLiveTracking" />}>
              <Route path="/live-tracking" element={<LiveTrackingPage />} />
              <Route path="/live-tracking/session/:sessionId" element={<EmployeeTrackingDetailsPage />} />
            </Route>

            {/* PRODUCTS */}
            <Route element={<PermissionGate module="products" feature="viewList" />}>
              <Route path="/products" element={<ProductPage />} />
            </Route>

            {/* SALES & ORDERS */}
            {/* SALES & ORDERS (Invoices) */}
            <Route element={<PermissionGate module="invoices" feature="viewList" />}>
              <Route path="/order/:orderId" element={<OrderDetailsPage />} />
            </Route>

            {/* ESTIMATES */}
            <Route element={<PermissionGate module="estimates" feature="viewList" />}>
              <Route path="/estimate/:estimateId" element={<EstimateDetailsPage />} />
            </Route>

            {/* SHARED LIST PAGE - Handles permissions internally or allows both */}
            <Route path="/order-lists" element={<SalesManagementPage />} />

            {/* SHARED CREATE PAGE - Handles Order/Estimate logic internally */}
            <Route path="/sales/create" element={<CreateTransactionPage />} />

            {/* EMPLOYEE MANAGEMENT */}
            <Route element={<PermissionGate module="employees" feature="viewList" />}>
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
            </Route>

            {/* ATTENDANCE & LEAVES */}
            <Route element={<PermissionGate module="attendance" feature="viewMyAttendance" />}>
              <Route path="/attendance" element={<AttendancePage />} />
            </Route>
            <Route element={<PermissionGate module="leaves" feature="viewList" />}>
              <Route path="/leaves" element={<LeavePage />} />
            </Route>

            {/* CRM / ENTITIES */}
            <Route element={<PermissionGate module="parties" feature="viewList" />}>
              <Route path="/parties" element={<PartyPage />} />
              <Route path="/parties/:partyId" element={<PartyDetailsPage />} />
            </Route>
            <Route element={<PermissionGate module="prospects" feature="viewList" />}>
              <Route path="/prospects" element={<ProspectPage />} />
              <Route path="/prospects/:prospectId" element={<ProspectDetailsPage />} />
            </Route>
            <Route element={<PermissionGate module="sites" feature="viewList" />}>
              <Route path="/sites" element={<SitePage />} />
              <Route path="/sites/:siteId" element={<SiteDetailsPage />} />
            </Route>

            {/* ANALYTICS (Composite: sales analytics + prospect dashboard + sites dashboard) */}
            <Route element={<PermissionGate module="analytics" customCheck={({ isFeatureEnabled, hasPermission }) =>
              (isFeatureEnabled('analytics') && hasPermission('analytics', 'viewMonthlyOverview')) ||
              (isFeatureEnabled('prospects') && hasPermission('prospectDashboard', 'viewProspectDashStats')) ||
              (isFeatureEnabled('sites') && hasPermission('sitesDashboard', 'viewSitesDashStats'))
            } />}>
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>

            {/* PLANNING (BEAT & TOUR) */}
            <Route element={<PermissionGate module="beatPlan" feature="viewList" />}>
              <Route path="/beat-plan" element={<BeatPlanPage />} />
            </Route>
            <Route element={<PermissionGate module="tourPlan" feature="viewList" />}>
              <Route path="/tour-plan" element={<TourPlanPage />} />
              <Route path="/tour-plan/:id" element={<TourPlanDetailPage />} />
            </Route>

            {/* EXPENSES */}
            <Route element={<PermissionGate module="expenses" feature="viewList" />}>
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/expenses/:id" element={<ExpenseDetailPage />} />
            </Route>

            {/* COLLECTIONS */}
            <Route element={<PermissionGate module="collections" feature="view" />}>
              <Route path="/collection" element={<CollectionPage />} />
              <Route path="/collection/:id" element={<CollectionDetailsPage />} />
            </Route>

            {/* ODOMETER */}
            <Route element={<PermissionGate module="odometer" feature="view" />}>
              <Route path="/odometer" element={<OdometerRecordsPage />} />
              <Route path="/odometer/employee/:employeeId" element={<OdometerDetailsPage />} />
              <Route path="/odometer/trip/:tripId" element={<TripDetailsPage />} />
            </Route>

            {/* NOTES */}
            <Route element={<PermissionGate module="notes" feature="viewList" />}>
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/notes/:id" element={<NotesDetailPage />} />
            </Route>

            {/* MISCELLANEOUS WORK */}
            <Route element={<PermissionGate module="miscellaneousWork" feature="viewList" />}>
              <Route path="/miscellaneous-work" element={<MiscellaneousWorkPage />} />
            </Route>

            {/* SETTINGS & ORG ADMIN PANEL */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route element={<PermissionGate module="settings" feature="view" />}>
              <Route path="/admin-panel" element={<AdminPanelPage />} />
            </Route>

            {/* PLATFORM OWNER ROUTES (Restricted to Superadmin/Developer roles) */}
            <Route element={<SystemAdminGate />}>
              {/* Redirect legacy /system-admin to dashboard */}
              <Route path="/system-admin" element={<Navigate to="/system-admin/dashboard" replace />} />

              <Route element={<SuperAdminLayout><Outlet /></SuperAdminLayout>}>
                <Route path="/system-admin/dashboard" element={<Dashboard />} />
                <Route path="/system-admin/organizations" element={<OrganizationListPage />} />
                <Route path="/system-admin/organizations/:id" element={<OrganizationDetailPage />} />
                <Route path="/system-admin/plans" element={<SubscriptionPlansPage />} />
                <Route path="/system-admin/users" element={<SystemUserListPage />} />
                <Route path="/system-admin/users/:userId" element={<SystemUserProfilePage />} />
                <Route path="/system-admin/activity-logs" element={<ActivityLogsPage />} />
                <Route path="/system-admin/security" element={<SuperAdminSecurityPage />} />
                <Route path="/system-admin/notifications" element={<SuperAdminNotificationsPage />} />
                <Route path="/system-admin/settings" element={<SuperAdminSettingsPage />} />
              </Route>
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;