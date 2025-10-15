import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar/Navbar';
import Footer from './components/layout/Footer/Footer';
import Homepage from './Pages/HomePage/Homepage';
import LoginPage from './Pages/LoginPage/login'; // Corrected import path
import DashboardPage from './Pages/DashboardPage/DashboardPage';
import EmployeesPage from './Pages/EmployeePage/EmployeesPage';
import EmployeeDetailsPage from './Pages/EmployeeDetailsPage/EmployeeDetailsPage';
import './index.css';

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
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/:employeeId" element={<EmployeeDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;