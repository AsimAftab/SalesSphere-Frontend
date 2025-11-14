import React, { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Layout & Context
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import { ModalProvider } from './components/modals/DemoModalContext';

// --- Corrected Auth Component Imports ---
import ProtectedRoute from './components/auth/ProtectedRoutes'; // Corrected name (was ProtectedRoutes)
import RoleBasedRoute from './components/auth/RoleBasedRoute'; // Import this
import ProtectedLayout from './components/layout/ProtectedLayout/ProtectedLayout';      // Import your new layout
import AuthGate from './components/auth/AuthGate';
// --- Old components (to be deleted) ---
// import SuperAdminRoute from './components/auth/SuperAdminRoute';
// import AutoLogoutWrapper from './components/auth/userIdleTimer';

// Spinner while pages lazy-load
const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

// Public homepage
import Homepage from './Pages/HomePage/Homepage';

/* -------------------------
   AUTH ROUTES (Lazy)
------------------------- */
const LoginPage = React.lazy(() => import('./Pages/LoginPage/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./Pages/LoginPage/ForgetPassword'));
const ContactAdminPage = React.lazy(() => import('./Pages/LoginPage/ContactAdmin'));
const ResetPasswordPage = React.lazy(() => import('./Pages/LoginPage/ResetPassword'));
const NotFoundPage = React.lazy(() => import('./Pages/NotFoundPage/NotFoundPage'));

/* -------------------------
   DASHBOARD / APP ROUTES
------------------------- */
const DashboardPage = React.lazy(() => import('./Pages/DashboardPage/DashboardPage'));
const LiveTrackingPage = React.lazy(() => import('./Pages/LiveTrackingPage/LiveTrackingPage'));
const EmployeeTrackingDetailsPage = React.lazy(
  () => import('./Pages/LiveTrackingPage/EmployeeTrackingDetailsPage')
);
const ProductPage = React.lazy(() => import('./Pages/ProductsPage/ProductsPage'));
const OrderList = React.lazy(() => import('./Pages/OrderListPage/OrderListPage'));
const OrderDetailsPage = React.lazy(() => import('./Pages/OrderDetailsPage/OrderDetailsPage'));
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
const CreateBeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/CreateBeatPlanPage'));
const EditBeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/EditBeatPlanPage'));
const SettingsPage = React.lazy(() => import('./Pages/SettingPage/SettingsPage'));
const SuperAdminPage = React.lazy(() => import('./Pages/SuperAdmin/SuperAdminPage'));
const SystemUserProfilePage = React.lazy(
  () => import('./Pages/SystemUserProfilePage/SystemUserProfilePage')
);

// Public Layout (Unchanged)
const PublicLayout = () => (
  <ModalProvider>
    <div className="bg-slate-900 text-white">
      <style>{`
        html { 
          scroll-behavior: smooth; 
          scroll-padding-top: 5rem;
        } 
      `}</style>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  </ModalProvider>
);

/* -------------------------
   ROUTER CONFIG
------------------------- */
const AppRoutes = () => {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* 🔑 AUTH ROUTES (Unchanged) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/contact-admin" element={<ContactAdminPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* 🌐 PUBLIC SITE ROUTE (Unchanged) */}
        <Route element={<AuthGate />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Homepage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
          <Route element={<RoleBasedRoute allowedRoles={['admin', 'manager']} redirectTo="/system-admin" />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/live-tracking" element={<LiveTrackingPage />} />
            <Route path="/employee-tracking/:id" element={<EmployeeTrackingDetailsPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/order-lists" element={<OrderList />} />
            <Route path="/order/:orderId" element={<OrderDetailsPage />} />
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
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
            <Route element={<RoleBasedRoute allowedRoles={['superadmin', 'developer']} redirectTo="/dashboard" />}>
              <Route path="/system-admin" element={<SuperAdminPage />} />
              <Route path="/system-admin/users/:userId" element={<SystemUserProfilePage />} />
            </Route>

          </Route>
        </Route>

        {/* CATCH-ALL 404 ROUTE (Unchanged) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;