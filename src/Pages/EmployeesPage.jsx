import React, { useState } from 'react';
import Sidebar from '../Components/layout/Sidebar/Sidebar';
import Header from '../Components/layout/Header/Header';
import EmployeeCard from '../Components/UI/EmployeeCard';
import Button from '../Components/UI/Button/Button';

const EmployeesPage = () => {
  const employeesData = [
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
    { name: 'John Doe', designation: 'Developer', email: 'john.doe@example.com', imageUrl: 'https://i.pravatar.cc/150?u=john' },
    { name: 'Jane Smith', designation: 'Designer', email: 'jane.smith@example.com', imageUrl: 'https://i.pravatar.cc/150?u=jane' },
    { name: 'Peter Jones', designation: 'Manager', email: 'peter.jones@example.com', imageUrl: 'https://i.pravatar.cc/150?u=peter' },
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
    { name: 'Karen Martinez', designation: 'Designer', email: 'karen.martinez@example.com', imageUrl: 'https://i.pravatar.cc/150?u=karen' },
    { name: 'Thomas Robinson', designation: 'Manager', email: 'thomas.robinson@example.com', imageUrl: 'https://i.pravatar.cc/150?u=thomas' },
    { name: 'Nancy Clark', designation: 'Developer', email: 'nancy.clark@example.com', imageUrl: 'https://i.pravatar.cc/150?u=nancy' },
    { name: 'Daniel Rodriguez', designation: 'Designer', email: 'daniel.rodriguez@example.com', imageUrl: 'https://i.pravatar.cc/150?u=daniel' },
    { name: 'Lisa Lewis', designation: 'Manager', email: 'lisa.lewis@example.com', imageUrl: 'https://i.pravatar.cc/150?u=lisa' },
    { name: 'Paul Lee', designation: 'Developer', email: 'paul.lee@example.com', imageUrl: 'https://i.pravatar.cc/150?u=paul' },
    { name: 'Betty Walker', designation: 'Designer', email: 'betty.walker@example.com', imageUrl: 'https://i.pravatar.cc/150?u=betty' },
    { name: 'Mark Hall', designation: 'Manager', email: 'mark.hall@example.com', imageUrl: 'https://i.pravatar.cc/150?u=mark' },
    { name: 'Sandra Allen', designation: 'Developer', email: 'sandra.allen@example.com', imageUrl: 'https://i.pravatar.cc/150?u=sandra' },
    { name: 'Donald Young', designation: 'Designer', email: 'donald.young@example.com', imageUrl: 'https://i.pravatar.cc/150?u=donald' },
    { name: 'Ashley Hernandez', designation: 'Manager', email: 'ashley.hernandez@example.com', imageUrl: 'https://i.pravatar.cc/150?u=ashley' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const totalPages = Math.ceil(employeesData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEmployees = employeesData.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage="Employees" />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto bg-slate-900">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Employees</h1>
            <Button>+ Add New Member</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentEmployees.map(employee => (
              <EmployeeCard key={employee.email} {...employee} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-8 text-sm text-gray-400">
            <p>
              Showing {startIndex + 1}-{Math.min(endIndex, employeesData.length)} of {employeesData.length}
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

export default EmployeesPage;
