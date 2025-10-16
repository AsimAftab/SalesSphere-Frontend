import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import ProfileCard from '../../components/UI/ProfileCard';
import Button from '../../components/UI/Button/Button';

const ProspectPage = () => {
  // Data for prospects
  const prospectData = [
    { name: 'Mary Johnson', designation: 'Developer', email: 'mary.johnson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=mary' },
    { name: 'David Williams', designation: 'Designer', email: 'david.williams@example.com', imageUrl: 'https://i.pravatar.cc/150?u=david' },
    { name: 'Susan Brown', designation: 'Manager', email: 'susan.brown@example.com', imageUrl: 'https://i.pravatar.cc/150?u=susan' },
    { name: 'Robert Davis', designation: 'Developer', email: 'robert.davis@example.com', imageUrl: 'https://i.pravatar.cc/150?u=robert' },
    { name: 'Linda Miller', designation: 'Designer', email: 'linda.miller@example.com', imageUrl: 'https://i.pravatar.cc/150?u=linda' },
    { name: 'James Wilson', designation: 'Manager', email: 'james.wilson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=james' },
    { name: 'Patricia Moore', designation: 'Developer', email: 'patricia.moore@example.com', imageUrl: 'https://i.pravatar.cc/150?u=patricia' },
    { name: 'Michael Taylor', designation: 'Designer', email: 'michael.taylor@example.com', imageUrl: 'https://i.pravatar.cc/150?u=michael' },
    { name: 'Barbara Anderson', designation: 'Manager', email: 'barbara.anderson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=barbara' },
    { name: 'William Thomas', designation: 'Developer', email: 'william.thomas@example.com', imageUrl: 'https://i.pravatar.cc/150?u=william' },
    { name: 'Elizabeth Jackson', designation: 'Designer', email: 'elizabeth.jackson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=elizabeth' },
    { name: 'Richard White', designation: 'Manager', email: 'richard.white@example.com', imageUrl: 'https://i.pravatar.cc/150?u=richard' },
    { name: 'Jennifer Harris', designation: 'Developer', email: 'jennifer.harris@example.com', imageUrl: 'https://i.pravatar.cc/150?u=jennifer' },
    { name: 'Charles Martin', designation: 'Designer', email: 'charles.martin@example.com', imageUrl: 'https://i.pravatar.cc/150?u=charles' },
    { name: 'Sarah Thompson', designation: 'Manager', email: 'sarah.thompson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=sarah' },
    { name: 'Joseph Garcia', designation: 'Developer', email: 'joseph.garcia@example.com', imageUrl: 'https://i.pravatar.cc/150?u=joseph' },
    { name: 'Jason Price', designation: 'Admin', email: 'janick_parisian@yahoo.com', imageUrl: 'https://i.pravatar.cc/150?u=jason' },
    { name: 'Jukkoe Sisao', designation: 'CEO', email: 'sibyl_koey@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=jukkoe' },
    { name: 'Harriet King', designation: 'CTO', email: 'nadia_block@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=harrietk' },
    { name: 'Lenora Benson', designation: 'Lead', email: 'feil.wallace@kunde.us', imageUrl: 'https://i.pravatar.cc/150?u=lenora' },
    { name: 'Olivia Reese', designation: 'Strategist', email: 'kemmer.hattie@cremin.us', imageUrl: 'https://i.pravatar.cc/150?u=olivia' },
    { name: 'Bertha Valdez', designation: 'Digital Marketer', email: 'loraine.koelpin@tromp.io', imageUrl: 'https://i.pravatar.cc/150?u=bertha' },
    { name: 'Harriett Payne', designation: 'CEO', email: 'nunnie_west@estrella.tv', imageUrl: 'https://i.pravatar.cc/150?u=harriettp' },
    { name: 'George Bryant', designation: 'Social Media', email: 'delmer.kling@gmail.com', imageUrl: 'https://i.pravatar.cc/150?u=george' },
    { name: 'Lily French', designation: 'Strategist', email: 'lucienne.herman@hotmail.com', imageUrl: 'https://i.pravatar.cc/150?u=lily' },
    { name: 'Howard Adkins', designation: 'CEO', email: 'wiegand.leonor@herman.us', imageUrl: 'https://i.pravatar.cc/150?u=howard' },
    { name: 'Earl Bowman', designation: 'Digital Marketer', email: 'waino_ankeny@nicolette.tv', imageUrl: 'https://i.pravatar.cc/150?u=earl' },
    { name: 'Patrick Padilla', designation: 'Social Media', email: 'octavia.nienow@gleichner.net', imageUrl: 'https://i.pravatar.cc/150?u=patrick' },
    // ... rest of your data
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(prospectData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProspects = prospectData.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <Sidebar>
      <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#202224]">Prospects</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentProspects.map(prospect => (
              <ProfileCard 
                key={prospect.email}
                basePath="/prospects"
                title={prospect.name}
                subtitle={prospect.designation}
                identifier={prospect.email}
                imageUrl={prospect.imageUrl}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-8 text-sm text-gray-600">
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, prospectData.length)} of {prospectData.length}
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
      </div>
    </Sidebar>
  );
};

export default ProspectPage;