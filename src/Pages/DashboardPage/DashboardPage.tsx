import React from 'react';
import Sidebar from '../../Components/layout/Sidebar/Sidebar';
import Header from '../../Components/layout/Header/Header';

const DashboardPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4">
          <h1 className="text-2xl font-bold">Dashboard Content</h1>
          <p>Main content goes here...</p>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
