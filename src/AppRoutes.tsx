import React, { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react'; 

// Import your layouts
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import { ModalProvider } from './components/modals/DemoModalContext.js'; // Check this path
import ProtectedRoute from './components/auth/ProtectedRoutes';
import AutoLogoutWrapper from './components/auth/AutoLogoutWrapper';

// --- Create a Page Spinner Fallback ---
const PageSpinner: React.FC = () => (
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
  </div>
);

// --- 1. EAGER-LOAD (Load Immediately) ---
import Homepage from './Pages/HomePage/Homepage';

// --- 2. LAZY-LOAD (Load On Demand) ---
const LoginPage = React.lazy(() => import('./Pages/LoginPage/login'));
const DashboardPage = React.lazy(() => import('./Pages/DashboardPage/DashboardPage'));
const LiveTrackingPage = React.lazy(() => import('./Pages/LiveTrackingPage/LiveTrackingPage'));
const EmployeeTrackingDetailsPage = React.lazy(() => import('./Pages/LiveTrackingPage/EmployeeTrackingDetailsPage'));
const ProductPage = React.lazy(() => import('./Pages/ProductsPage/ProductsPage.js'));
const OrderList = React.lazy(() => import('./Pages/OrderListPage/OrderListPage.js'));
const OrderDetailsPage = React.lazy(() => import('./Pages/OrderDetailsPage/OrderDetailsPage'));
const EmployeesPage = React.lazy(() => import('./Pages/EmployeePage/EmployeesPage'));
const EmployeeDetailsPage = React.lazy(() => import('./Pages/EmployeeDetailsPage/EmployeeDetailsPage'));
const PartyDetailsPage = React.lazy(() => import('./Pages/PartyDetailsPage/PartyDetailsPage'));
const AttendancePage = React.lazy(() => import('./Pages/AttendancePage/AttendancePage'));
const PartyPage = React.lazy(() => import('./Pages/PartyPage/PartyPage'));
const ProspectPage = React.lazy(() => import('./Pages/ProspectPage/ProspectPage'));
const ProspectDetailsPage = React.lazy(() => import('./Pages/ProspectDetailsPage/ProspectDetailsPage'));
const SitePage = React.lazy(() => import('./Pages/SitePage/SitePage'));
const SiteDetailsPage = React.lazy(() => import('./Pages/SiteDetailsPage/SiteDetailsPage'));
const AnalyticsPage = React.lazy(() => import('./Pages/AnalyticsPage/AnalyticsPage'));
const BeatPlanPage = React.lazy(() => import('./Pages/BeatPlanPage/BeatPlanPage'));
const CreateBeatPlanPage = React.lazy(() => import('./Pages/CreateBeatPlanPage/CreateBeatPlanPage'));
const EditBeatPlanPage = React.lazy(() => import('./Pages/EditBeatPlanPage/EditBeatPlanPage'));
const SettingsPage = React.lazy(() => import('./Pages/SettingPage/SettingsPage'));
const SuperAdminPage = React.lazy(() => import('./Pages/SuperAdmin/SuperAdminPage'));
const SystemUserProfilePage = React.lazy(() => import('./Pages/SystemUserProfilePage/SystemUserProfilePage'));
// ------------------------------------------------

// Public layout (Unchanged)
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

// This component contains all your app's routes
const AppRoutes = () => {
  return (
    // 3. Wrap all routes in Suspense
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        {/* =================
          PUBLIC ROUTES
        ================= */}
        <Route path="/login" element={<LoginPage />} /> {/* Now lazy-loaded */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Homepage />} /> {/* Eager-loaded */}
        </Route>

        {/* =================
          PROTECTED ROUTES
        ================= */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AutoLogoutWrapper />}>
            {/* All protected routes are lazy-loaded */}
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
            <Route path="/super-admin" element={<SuperAdminPage />} />
            <Route path="/system-users/:userId" element={<SystemUserProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;