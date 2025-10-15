import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import ProfileCard from '../../components/UI/ProfileCard'; // Use the generic ProfileCard
import Button from '../../components/UI/Button/Button';

const SitePage = () => {
  // Data for sites with more relevant properties
  const siteData = [
    { id: 'site-01', name: 'Main Warehouse', location: 'Bengaluru, KA', email: 'main.wh@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site1' },
    { id: 'site-02', name: 'North Hub', location: 'Delhi, DL', email: 'north.hub@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site2' },
    { id: 'site-03', name: 'West Distribution', location: 'Mumbai, MH', email: 'west.dist@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site3' },
    { id: 'site-04', name: 'East Depot', location: 'Kolkata, WB', email: 'east.depot@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site4' },
    { id: 'site-05', name: 'South Center', location: 'Chennai, TN', email: 'south.center@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site5' },
    { id: 'site-06', name: 'Central Point', location: 'Nagpur, MH', email: 'central.point@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site6' },
    { id: 'site-07', name: 'Jaipur Outlet', location: 'Jaipur, RJ', email: 'jaipur.outlet@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site7' },
    { id: 'site-08', name: 'Hyderabad Branch', location: 'Hyderabad, TS', email: 'hyd.branch@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site8' },
    { id: 'site-09', name: 'Pune Office', location: 'Pune, MH', email: 'pune.office@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site9' },
    { id: 'site-10', name: 'Ahmedabad Unit', location: 'Ahmedabad, GJ', email: 'ahd.unit@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site10' },
    { id: 'site-11', name: 'Lucknow Center', location: 'Lucknow, UP', email: 'lko.center@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site11' },
    { id: 'site-12', name: 'Kochi Port', location: 'Kochi, KL', email: 'kochi.port@example.com', imageUrl: 'https://i.pravatar.cc/150?u=site12' },
    // ... add more site data as needed
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(siteData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSites = siteData.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-[#F5F6FA]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#202224]">Sites</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentSites.map(site => (
              <ProfileCard 
                key={site.id}
                basePath="/sites"
                title={site.name}
                subtitle={site.location}
                identifier={site.email}
                imageUrl={site.imageUrl}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-8 text-sm text-gray-600">
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, siteData.length)} of {siteData.length}
            </p>
            <div className="flex">
              <Button onClick={goToPreviousPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button onClick={goToNextPage} disabled={currentPage === totalPages} className="ml-2">
                Next
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SitePage;