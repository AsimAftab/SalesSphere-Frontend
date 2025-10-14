import React from 'react';
import Sidebar from '../../Components/layout/Sidebar/Sidebar';
import Header from '../../Components/layout/Header/Header';
import DashboardContent from '../../Components/DashboardContent';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage="Dashboard" />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header />
        <main>
          <DashboardContent />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
