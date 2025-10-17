import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Homepage from './Pages/HomePage/Homepage';
import LoginPage from './Pages/LoginPage/login'; 
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import ProductPage from './Pages/Products/Products';
import OrderList from './Pages/OrderList/OrderList';
import OrderDetailsPage from './Pages/OrderDetailsPage/OrderDetailsPage';
import EmployeesPage from './Pages/EmployeePage/EmployeesPage';
import EmployeeDetailsPage from './Pages/EmployeeDetailsPage/EmployeeDetailsPage';
import AttendancePage from './Pages/AttendancePage/AttendancePage';
import PartyPage from './Pages/PartyPage/PartyPage';
import ProspectPage from './Pages/ProspectPage/ProspectPage';
import SitePage from './Pages/SitePage/SitePage';
import AnalyticsPage from './Pages/AnalyticsPage/AnalyticsPage';
import BeatPlanPage from './Pages/BeatPlanPage/BeatPlanPage';
import CreateBeatPlanPage from './Pages/CreateBeatPlanPage/CreateBeatPlanPage';
import SettingsPage from './Pages/SettingPage/SettingsPage.js';

// --- IMPORT THE PROVIDER ---
import { ModalProvider } from './context/ModalContext';

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
        <Route path="/products" element={<ProductPage />} />
        <Route path="/order-lists" element={<OrderList />} />
        <Route path="/order/:orderId" element={<OrderDetailsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/parties" element={<PartyPage />} />
        <Route path="/prospects" element={<ProspectPage />} />
        <Route path="/sites" element={<SitePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/beat-plan" element={<BeatPlanPage />} />
        <Route path="/beat-plan/create" element={<CreateBeatPlanPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;