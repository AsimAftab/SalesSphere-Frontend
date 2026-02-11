import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/* -------------------------
    LAYOUT & AUTH COMPONENTS
------------------------- */
import { ContactUsModalProvider } from '@/components/modals/ContactUsModalContext';
import { SocketProvider } from '@/providers/SocketProvider';

import ProtectedRoute from '@/components/auth/ProtectedRoutes';
import PermissionGate from '@/components/auth/PermissionGate';
import ProtectedLayout from '@/components/auth/ProtectedLayout';
import AuthGate from '@/components/auth/AuthGate';
import SystemAdminGate from '@/components/auth/SystemAdminGate';
import SuperAdminLayout from '@/components/layout/SuperAdminLayout/SuperAdminLayout';

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

const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

/* -------------------------
    LAZY LOADED PAGES
------------------------- */
// Public
const LandingPage = React.lazy(() => import('@/pages/LandingPage/LandingPage'));
const LandingNavbar = React.lazy(() => import('@/pages/LandingPage/components/Navbar/LandingNavbar'));
const Footer = React.lazy(() => import('@/pages/LandingPage/components/Footer/Footer'));
const ScheduleDemoPage = React.lazy(() => import('@/pages/ScheduleDemoPage'));
const TermsAndConditionsPage = React.lazy(() => import('@/pages/TermsAndConditionsPage'));
const PrivacyPolicyPage = React.lazy(() => import('@/pages/PrivacyPolicyPage'));
const HelpCenterPage = React.lazy(() => import('@/pages/HelpCenterPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('@/pages/LoginPage/ForgetPassword'));
const ContactAdminPage = React.lazy(() => import('@/pages/LoginPage/ContactAdmin'));
const ResetPasswordPage = React.lazy(() => import('@/pages/LoginPage/ResetPassword'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const BlogListPage = React.lazy(() => import('@/pages/BlogPage'));
const BlogDetailPage = React.lazy(() => import('@/pages/BlogDetailPage'));

// Dashboard & Tracking
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const LiveTrackingPage = React.lazy(() => import('@/pages/LiveTrackingPage'));
const EmployeeTrackingDetailsPage = React.lazy(() => import('@/pages/LiveTrackingPage/tabs/EmployeeTracking/SessionDetails/EmployeeTrackingDetailsPage'));

// Core Modules
const ProductPage = React.lazy(() => import('@/pages/ProductsPage'));
const SalesManagementPage = React.lazy(() => import('@/pages/OrderListPage'));
const CreateTransactionPage = React.lazy(() => import('@/pages/OrderListPage/Transaction/CreateTransactionPage'));
const OrderDetailsPage = React.lazy(() => import('@/pages/OrderDetailsPage'));
const EstimateDetailsPage = React.lazy(() => import('@/pages/OrderDetailsPage/Estimate/EstimateDetailsPage'));

// Employee & Attendance
const EmployeePage = React.lazy(() => import('@/pages/EmployeePage'));
const EmployeeDetailsPage = React.lazy(() => import('@/pages/EmployeeDetailsPage'));
const AttendancePage = React.lazy(() => import('@/pages/AttendancePage'));
const LeavePage = React.lazy(() => import('@/pages/LeavePage'));

// Entities
const PartyPage = React.lazy(() => import('@/pages/EntityPages/PartyPage'));
const PartyDetailsPage = React.lazy(() => import('@/pages/EntityPages/PartyDetailPage'));
const ProspectPage = React.lazy(() => import('@/pages/EntityPages/ProspectPage'));
const ProspectDetailsPage = React.lazy(() => import('@/pages/EntityPages/ProspectDetailPage'));
const SitePage = React.lazy(() => import('@/pages/EntityPages/SitePage'));
const SiteDetailsPage = React.lazy(() => import('@/pages/EntityPages/SiteDetailPage'));

// Planning, Expenses & Collection
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));
const BeatPlanPage = React.lazy(() => import('@/pages/BeatPlanPage'));
const TourPlanPage = React.lazy(() => import('@/pages/TourPlanPage'));
const TourPlanDetailPage = React.lazy(() => import('@/pages/TourPlanDetailPage'));
const ExpensesPage = React.lazy(() => import('@/pages/ExpensesPage'));
const ExpenseDetailPage = React.lazy(() => import('@/pages/ExpenseDetailPage'));
const CollectionPage = React.lazy(() => import('@/pages/CollectionPage'));
const CollectionDetailsPage = React.lazy(() => import('@/pages/CollectionDetailsPage'));

// Notes, Miscellaneous Work & Odometer
const NotesPage = React.lazy(() => import('@/pages/NotesPage'));
const NotesDetailPage = React.lazy(() => import('@/pages/NotesDetailPage'));
const MiscellaneousWorkPage = React.lazy(() => import('@/pages/MiscellaneousWorkPage'));
const OdometerRecordsPage = React.lazy(() => import('@/pages/OdometerPages/OdometerRecordsPage'));
const OdometerDetailsPage = React.lazy(() => import('@/pages/OdometerPages/OdometerDetailsPage'));
const TripDetailsPage = React.lazy(() => import('@/pages/OdometerPages/TripDetailsPage'));

// Admin & System
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const AdminPanelPage = React.lazy(() => import('@/pages/AdminPanelPage'));
const Dashboard = React.lazy(() => import('@/pages/SuperAdminPages/Dashboard'));
const OrganizationListPage = React.lazy(() => import('@/pages/SuperAdminPages/Organizations').then(module => ({ default: module.OrganizationListPage })));
const OrganizationDetailPage = React.lazy(() => import('@/pages/SuperAdminPages/Organizations').then(module => ({ default: module.OrganizationDetailPage })));
const PaymentHistoryPage = React.lazy(() => import('@/pages/SuperAdminPages/Organizations').then(module => ({ default: module.PaymentHistoryPage })));
const SubscriptionPlansPage = React.lazy(() => import('@/pages/SuperAdminPages/Plans').then(module => ({ default: module.SubscriptionPlansPage }))); // Mapped to folder
const CreateCustomPlanPage = React.lazy(() => import('@/pages/SuperAdminPages/Plans/CreateCustomPlanPage'));
const SubscriptionPlanDetailPage = React.lazy(() => import('@/pages/SuperAdminPages/Plans').then(module => ({ default: module.SubscriptionPlanDetailPage })));
const NewsletterPage = React.lazy(() => import('@/pages/SuperAdminPages/Newsletter')); // Mapped to folder
const SystemUserListPage = React.lazy(() => import('@/pages/SuperAdminPages/Users').then(module => ({ default: module.SystemUserListPage })));
const SystemUserDetailsPage = React.lazy(() => import('@/pages/SuperAdminPages/Users').then(module => ({ default: module.SystemUserDetailsPage })));

const SuperAdminSettingsPage = React.lazy(() => import('@/pages/SuperAdminPages/Settings')); // Mapped to folder
const BlogManagementPage = React.lazy(() => import('@/pages/SuperAdminPages/Blog/BlogManagementPage'));
const BlogEditorPage = React.lazy(() => import('@/pages/SuperAdminPages/Blog/BlogEditorPage'));

/* -------------------------
    LAYOUT WRAPPERS
------------------------- */
const PublicLayout = () => (
  <ContactUsModalProvider>
    <div className="bg-slate-900 text-white min-h-screen">
      <Suspense fallback={null}>
        <LandingNavbar />
      </Suspense>
      <main><Outlet /></main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  </ContactUsModalProvider>
);

/* -------------------------
    ROUTER CONFIG
------------------------- */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSpinner />}>
      <ScrollToTopOnRouteChange />
      <Routes>
        {/* PUBLIC ACCESS / AUTH GATEWAY 
            AuthGate prevents logged-in users from seeing '/login' */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/schedule-demo" element={<ScheduleDemoPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
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
          <Route element={<SocketProvider><ProtectedLayout /></SocketProvider>}>

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
              <Route path="/employees" element={<EmployeePage />} />
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
                <Route path="/system-admin/organizations/:id/payments" element={<PaymentHistoryPage />} />
                <Route path="/system-admin/plans" element={<SubscriptionPlansPage />} />
                <Route path="/system-admin/plans/create" element={<CreateCustomPlanPage />} />
                <Route path="/system-admin/plans/:id/edit" element={<CreateCustomPlanPage />} />
                <Route path="/system-admin/plans/:id" element={<SubscriptionPlanDetailPage />} />
                <Route path="/system-admin/newsletter" element={<NewsletterPage />} />
                <Route path="/system-admin/users" element={<SystemUserListPage />} />
                <Route path="/system-admin/system-users/:id" element={<SystemUserDetailsPage />} />

                <Route path="/system-admin/settings" element={<SuperAdminSettingsPage />} />
                <Route path="/system-admin/blog" element={<BlogManagementPage />} />
                <Route path="/system-admin/blog/new" element={<BlogEditorPage />} />
                <Route path="/system-admin/blog/edit/:id" element={<BlogEditorPage />} />
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
