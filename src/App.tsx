// src/App.tsx

import React, { useState } from 'react';
import Navbar from './Components/layout/Navbar/Navbar';
import Footer from './Components/layout/Footer/Footer';
import Homepage from './Pages/HomePage/Homepage';
import LoginPage from './Pages/login_page'; 
import './index.css';

type Page = 'home' | 'login';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home'); 
  const renderContent = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'home':
      default:
        return (
          <>
            <Navbar onLoginClick={() => setCurrentPage('login')} />
            <Homepage />
            <Footer />
          </>
        );
    }
  };

  return (
    <div className={currentPage === 'home' ? "bg-slate-900 text-white" : ""}>
      {renderContent()}
    </div>
  );
}

export default App;