import { Routes, Route, Outlet } from 'react-router-dom';

// Import your layouts
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import { ModalProvider } from './components/modals/DemoModalContext.js';
import ProtectedRoute from './components/auth/ProtectedRoutes'; // <-- IMPORT
import AutoLogoutWrapper from './components/auth/AutoLogoutWrapper';
// Import your pages
import Homepage from './Pages/HomePage/Homepage';
import LoginPage from './Pages/LoginPage/login';
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import LiveTrackingPage from './Pages/LiveTrackingPage/LiveTrackingPage';
import EmployeeTrackingDetailsPage from './Pages/LiveTrackingPage/EmployeeTrackingDetailsPage';
import ProductPage from './Pages/ProductsPage/ProductsPage.js';
import OrderList from './Pages/OrderListPage/OrderListPage.js';
import OrderDetailsPage from './Pages/OrderDetailsPage/OrderDetailsPage';
import EmployeesPage from './Pages/EmployeePage/EmployeesPage';
import EmployeeDetailsPage from './Pages/EmployeeDetailsPage/EmployeeDetailsPage';
import PartyDetailsPage from './Pages/PartyDetailsPage/PartyDetailsPage';
import AttendancePage from './Pages/AttendancePage/AttendancePage';
import PartyPage from './Pages/PartyPage/PartyPage';
import ProspectPage from './Pages/ProspectPage/ProspectPage';
import ProspectDetailsPage from './Pages/ProspectDetailsPage/ProspectDetailsPage';
import SitePage from './Pages/SitePage/SitePage';
import SiteDetailsPage from './Pages/SiteDetailsPage/SiteDetailsPage';
import AnalyticsPage from './Pages/AnalyticsPage/AnalyticsPage';
import BeatPlanPage from './Pages/BeatPlanPage/BeatPlanPage';
import CreateBeatPlanPage from './Pages/CreateBeatPlanPage/CreateBeatPlanPage';
import EditBeatPlanPage from './Pages/EditBeatPlanPage/EditBeatPlanPage';
import SettingsPage from './Pages/SettingPage/SettingsPage.js';
import SuperAdminPage from './Pages/SuperAdminPage';
import SystemUserProfilePage from './Pages/SystemUserProfilePage/SystemUserProfilePage';

// This is your public-facing layout (Homepage, etc.)
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
    <Routes>
      {/* =================
        PUBLIC ROUTES
        =================
        These routes are accessible to everyone.
      */}
      <Route path="/login" element={<LoginPage />} />
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Homepage />} />
        {/* Add any other public-facing routes here (e.g., /about, /contact) */}
      </Route>

      {/* =================
        PROTECTED ROUTES
        =================
        These routes are wrapped by <ProtectedRoute />.
        If the user is not logged in, they will be redirected to /login.
      */}
      <Route element={<ProtectedRoute />}>
        {/* All your app routes go inside here as children */}

        <Route element={<AutoLogoutWrapper />}>
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

        {/* You could also add a dedicated "app layout" here if you have one
        <Route element={<AppShell />}>
           <Route path="/dashboard" element={<DashboardPage />} />
           ...
        </Route>
        */}
      </Route>
      </Route>
      {/* Optional: Add a 404 Not Found route
      <Route path="*" element={<NotFoundPage />} /> 
      */}
    </Routes>
  );
};

export default AppRoutes;