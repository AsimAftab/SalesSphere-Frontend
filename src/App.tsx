import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Homepage from './Pages/HomePage/Homepage';
import LoginPage from './Pages/LoginPage/login';
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import LiveTrackingPage from './Pages/LiveTrackingPage/LiveTrackingPage';
import EmployeeTrackingDetailsPage from './Pages/LiveTrackingPage/EmployeeTrackingDetailsPage';
import ProductPage from './Pages/Products/ProductsPage.js';
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

// --- IMPORT THE PROVIDER ---
import { ModalProvider } from './context/ModalContext';
import { Toaster } from 'sonner';

const AppLayout = () => (
  <div className="bg-slate-900 text-white">
    <style>{`
      html { 
        scroll-behavior: smooth; 
        scroll-padding-top: 5rem; /* THIS IS THE FIX */
      } 
    `}</style>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <div className="bg-white text-gray-800">
      <Toaster
        position="top-right"
        richColors
        closeButton={true}
        toastOptions={{
          style: {
            padding: '16px',
          },
          classNames: {
            closeButton: 'bg-white border border-gray-300 hover:bg-gray-100',
          }
        }}
      />
      <Routes>
        {/* Wrap the entire AppLayout route with ModalProvider */}
        <Route
          element={
            <ModalProvider>
              <AppLayout />
            </ModalProvider>
          }
        >
          {/* Homepage is now a child of AppLayout and ModalProvider */}
          <Route path="/" element={<Homepage />} />
          {/* Add other public routes that might need the modal here */}
        </Route>
        <Route path="/login" element={<LoginPage />} />
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
      </Routes>
    </div>
  );
}

export default App;

