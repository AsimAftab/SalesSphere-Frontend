import React, { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/* -------------------------
    LAYOUT & CONTEXT
------------------------- */
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import { ModalProvider } from './components/modals/DemoModalContext';
import { ContactUsModalProvider } from './components/modals/ContactUsModalContext';

import ProtectedRoute from './components/auth/ProtectedRoutes';
import RoleBasedRoute from './components/auth/RoleBasedRoute';
import ProtectedLayout from './components/layout/ProtectedLayout/ProtectedLayout';
import AuthGate from './components/auth/AuthGate';

/* -------------------------
    PAGE SPINNER
------------------------- */
const PageSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

/* -------------------------
    PUBLIC PAGES
------------------------- */
import Homepage from './Pages/HomePage/Homepage';

const LoginPage = React.lazy(() => import('./Pages/LoginPage/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./Pages/LoginPage/ForgetPassword'));
const ContactAdminPage = React.lazy(() => import('./Pages/LoginPage/ContactAdmin'));
const ResetPasswordPage = React.lazy(() => import('./Pages/LoginPage/ResetPassword'));
const NotFoundPage = React.lazy(() => import('./Pages/NotFoundPage/NotFoundPage'));
const TermsAndConditionsPage = React.lazy(() => import('./Pages/TermsAndConditionsPage/TermsAndConditionsPage'));
const PrivacyPolicyPage = React.lazy(() => import('./Pages/PrivacyPolicyPage/PrivacyPolicyPage'));
const AboutUsPage = React.lazy(() => import('./Pages/AboutUsPage/AboutUsPage'));

/* -------------------------
    PROTECTED PAGES (Lazy)
------------------------- */
const DashboardPage = React.lazy(() => import('./Pages/DashboardPage/DashboardPage'));
const LiveTrackingPage = React.lazy(() => import('./Pages/LiveTrackingPage/LiveTrackingPage'));
const EmployeeTrackingDetailsPage = React.lazy(
  () => import('./Pages/LiveTrackingPage/EmployeeTrackingDetailsPage')
);
const TrackingHistoryPage = React.lazy(
  () => import('./Pages/LiveTrackingPage/TrackingHistoryView')
);
const ProductPage = React.lazy(() => import('./Pages/ProductsPage/ProductsPage'));

// Sales & Estimate Management
const SalesManagementPage = React.lazy(() => import('./Pages/OrderListPage/SalesManagementPage'));
const OrderDetailsPage = React.lazy(() => import('./Pages/OrderDetailsPage/OrderDetailsPage'));
const CreateTransactionPage = React.lazy(() => import('./Pages/OrderListPage/CreateTransactionPage'));

// Dedicated Estimate Details Page
const EstimateDetailsPage = React.lazy(() => import('./Pages/OrderDetailsPage/EstimateDetailPage'));

const EmployeesPage = React.lazy(() => import('./Pages/EmployeePage/EmployeesPage'));
const EmployeeDetailsPage = React.lazy(
  () => import('./Pages/EmployeeDetailsPage/EmployeeDetailsPage')
);
const PartyDetailsPage = React.lazy(() => import('./Pages/PartyDetailsPage/PartyDetailsPage'));
const AttendancePage = React.lazy(() => import('./Pages/AttendancePage/AttendancePage'));
const PartyPage = React.lazy(() => import('./Pages/PartyPage/PartyPage'));
const ProspectPage = React.lazy(() => import('./Pages/ProspectPage/ProspectPage'));
const ProspectDetailsPage = React.lazy(
  () => import('./Pages/ProspectDetailsPage/ProspectDetailsPage')
);
const SitePage = React.lazy(() => import('./Pages/SitePage/SitePage'));
const SiteDetailsPage = React.lazy(() => import('./Pages/SiteDetailsPage/SiteDetailsPage'));
const AnalyticsPage = React.lazy(() => import('./Pages/AnalyticsPage/AnalyticsPage'));
const BeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/BeatPlanPage'));
const MiscellaneousWorkPage = React.lazy(() => import('./Pages/MiscellaneousWorkPage/MiscellaneousWorkPage'));

// NEW: Tour Plan Import
const TourPlanPage = React.lazy(() => import('./Pages/TourPlanPage/TourPlanPage'));
const TourPlanDetailPage = React.lazy(() => import('./Pages/TourPlanDetailPage/TourPlanDetailPage'));

// Expenses Module
const ExpensesPage = React.lazy(() => import('./Pages/ExpensesPage/ExpensesPage'));
const ExpenseDetailPage = React.lazy(() => import('./Pages/ExpenseDetailPage/ExpenseDetailPage'));

const CreateBeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/CreateBeatPlanPage'));
const EditBeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/EditBeatPlanPage'));
const SettingsPage = React.lazy(() => import('./Pages/SettingPage/SettingsPage'));
const SuperAdminPage = React.lazy(() => import('./Pages/SuperAdmin/SuperAdminPage'));
const SystemUserProfilePage = React.lazy(
  () => import('./Pages/SystemUserProfilePage/SystemUserProfilePage')
);

/* -------------------------
    PUBLIC SITE LAYOUT
------------------------- */
const PublicLayout = () => (
  <ModalProvider>
    <ContactUsModalProvider>
      <div className="bg-slate-900 text-white">
        <style>{`
          html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
        `}</style>

        <Navbar />
        <main>
          <Outlet />
        </main>
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

        {/* UNAUTHENTICATED ROUTES */}
        <Route element={<AuthGate />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Homepage />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/contact-admin" element={<ContactAdminPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>

            {/* ADMIN + MANAGER ACCESS */}
            <Route
              element={
                <RoleBasedRoute
                  allowedRoles={['admin', 'manager']}
                  redirectTo="/system-admin"
                />
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/live-tracking" element={<LiveTrackingPage />} />
              <Route path="/tracking-history" element={<TrackingHistoryPage />}/>
              <Route path="/live-tracking/session/:sessionId" element={<EmployeeTrackingDetailsPage />} />
              <Route path="/products" element={<ProductPage />} />
              
              <Route path="/order-lists" element={<SalesManagementPage />} />
              <Route path="/sales/create" element={<CreateTransactionPage />} />
              <Route path="/order/:orderId" element={<OrderDetailsPage />} />
              <Route path="/estimate/:estimateId" element={<EstimateDetailsPage />} />

              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/parties" element={<PartyPage />} />
              <Route path="/parties/:partyId" element={<PartyDetailsPage />} />
              <Route path="/prospects" element={<ProspectPage />} />
              <Route path="/prospects/:prospectId" element={<ProspectDetailsPage />} />
              <Route path="/sites" element={<SitePage />} />
              <Route path="/sites/:siteId" element={<SiteDetailsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              
              <Route path="/beat-plan" element={<BeatPlanPage />} />
              <Route path="/beat-plan/create" element={<CreateBeatPlanPage />} />
              <Route path="/beat-plan/edit/:planId" element={<EditBeatPlanPage />} />
              
              {/* Added Tour Plan Route */}
              <Route path="/tour-plan" element={<TourPlanPage />} />
              <Route path="/tour-plan/:id" element={<TourPlanDetailPage />} />
              
              <Route path="/miscellaneous-work" element={<MiscellaneousWorkPage />} />
              
              <Route path="/expenses" element={<ExpensesPage />} /> 
              <Route path="/expenses/:id" element={<ExpenseDetailPage />} /> 

              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* SUPERADMIN + DEVELOPER ACCESS */}
            <Route
              element={
                <RoleBasedRoute
                  allowedRoles={['superadmin', 'developer']}
                  redirectTo="/dashboard"
                />
              }
            >
              <Route path="/system-admin" element={<SuperAdminPage />} />
              <Route path="/system-admin/users/:userId" element={<SystemUserProfilePage />} />
            </Route>

          </Route>
        </Route>

        {/* 404 PAGE */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </Suspense>
  );
};

export default AppRoutes;