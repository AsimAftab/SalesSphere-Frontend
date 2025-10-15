import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Homepage from './Pages/HomePage/Homepage';
import LoginPage from './Pages/LoginPage/login'; // Corrected import path
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import EmployeesPage from './Pages/EmployeePage/EmployeesPage';
import EmployeeDetailsPage from './Pages/EmployeeDetailsPage/EmployeeDetailsPage';
import PartyPage from './Pages/PartyPage/PartyPage';
import ProspectPage from './Pages/ProspectPage/ProspectPage';
import SitePage from './Pages/SitePage/SitePage';

import ProductPage from './Pages/Products/Products';
import OrderList from './Pages/OrderList/OrderList';
import SettingsPage from './Pages/SettingPage';

const AppLayout = () => (
  <div className="bg-slate-900 text-white">
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
        <Route path="/orderlist" element={<OrderList />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
        <Route path="/parties" element={<PartyPage />} />
        <Route path="/prospects" element={<ProspectPage />} />
        <Route path="/sites" element={<SitePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}

export default App;