// src/App.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './Components/layout/Navbar/Navbar';
import Footer from './Components/layout/Footer/Footer';
import Homepage from './Pages/HomePage/Homepage';
import LoginPage from './Pages/LoginPage/login'; 
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
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Homepage />} />
        </Route>
        
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;