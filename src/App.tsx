import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Homepage from './Pages/HomePage/Homepage';
import LoginPage from './Pages/LoginPage/login'; 
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import ProductPage from './Pages/Products/Products';
import OrderList from './Pages/OrderList/OrderList';
import EmployeesPage from './Pages/EmployeePage/EmployeesPage';
import EmployeeDetailsPage from './Pages/EmployeeDetailsPage/EmployeeDetailsPage';
import AttendancePage from './Pages/AttendancePage/AttendancePage';
import PartyPage from './Pages/PartyPage/PartyPage';
import ProspectPage from './Pages/ProspectPage/ProspectPage';
import SitePage from './Pages/SitePage/SitePage';
import AnalyticsPage from './Pages/AnalyticsPage/AnalyticsPage';
import SettingsPage from './Pages/SettingPage/SettingsPage.js';


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
        <Route element={<AppLayout />}>
          <Route path="/" element={<Homepage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/order-lists" element={<OrderList />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/parties" element={<PartyPage />} />
        <Route path="/prospects" element={<ProspectPage />} />
        <Route path="/sites" element={<SitePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;