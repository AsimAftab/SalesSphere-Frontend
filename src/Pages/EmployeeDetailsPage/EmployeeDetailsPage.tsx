import React, { useState } from 'react';

// Layout Components
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import Header from '../../components/layout/Header/Header';
import Button from '../../components/UI/Button/Button';

// Reusable Card Components
import ProfileHeaderCard from '../../components/cards/details/ProfileHeaderCard';
import EmployeeInfoCard from '../../components/cards/details/EmployeeInfoCard';
import AttendanceSummaryCard from '../../components/cards/details/AttendanceSummaryCard';
import ContactInfoCard from '../../components/cards/details/ContactInfoCard';
import DocumentsCard from '../../components/cards/details/DocumentsCard';
import EditEmployeeModal from '../../components/modals/EditEmployeeModal';

// Mock Data (replace with API data later)
const employeeData = {
  imageUrl: 'https://i.pravatar.cc/150?u=naomi',
  name: 'Naomi King',
  title: 'Product Manager',
  infoDetails: [
    { label: 'Gender', value: 'Male' },
    { label: 'Age', value: '27 years' },
    { label: 'Phone Number', value: '9800000000' },
    { label: 'PAN Number', value: '3000000000' },
    { label: 'Citizenship Number', value: '3000000000' },
    { label: 'Date Joined', value: 'April 28, 2021' },
  ],
  attendance: {
    percentage: 78,
    stats: [
      { value: 20, label: 'Present', color: 'bg-blue-500' },
      { value: 1, label: 'Absent', color: 'bg-red-500' },
      { value: 2, label: 'Half Day', color: 'bg-yellow-500' },
    ],
  },
  contact: {
    title: 'Contact Information',
    details: [
      { label: 'Email Address', value: 'naomiking@mail.com' },
      { label: 'Phone Number', value: '9800000000' },
      { label: 'Address', value: 'Shanti Chowk, Biratnagar, Nepal' },
    ],
  },
  documents: {
    title: 'Documents & Files',
    files: [
      { name: 'Employment Contract.pdf', size: '1.2 MB', date: '2021-04-2' },
      { name: 'PAN Card.pdf', size: '2.4 MB', date: '2021-04-2' },
      { name: 'Citizenship card.pdf', size: '987 KB', date: '2021-04-2' },
    ],
  },
};


const EmployeeDetailsPage: React.FC = () => {
  // If you need the employeeId later you can get it from the URL with useParams()
  // const { employeeId } = useParams();

  // Modal open state for editing employee
  const [isEditOpen, setIsEditOpen] = useState(false);

  // In a real app, you would use employeeId to fetch data from your API.
  // For now, we'll use the mock data.

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activePage="Employees" />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto bg-[#F5F6FA]">
          {/* --- Page Header --- */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Employee Details</h1>
            <Button variant="primary" onClick={() => setIsEditOpen(true)}>Edit Employee Details</Button>
          </div>

          {/* --- Main Two-Column Layout --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* --- Left Column --- */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileHeaderCard 
                name={employeeData.name}
                title={employeeData.title}
                imageUrl={employeeData.imageUrl}
              />
              <EmployeeInfoCard details={employeeData.infoDetails} />
              <AttendanceSummaryCard 
                percentage={employeeData.attendance.percentage} 
                stats={employeeData.attendance.stats} 
              />
            </div>
            
            {/* --- Right Column --- */}
            <div className="lg:col-span-1 space-y-6">
              <ContactInfoCard 
                title={employeeData.contact.title}
                contacts={employeeData.contact.details}
              />
              <DocumentsCard 
                title={employeeData.documents.title}
                files={employeeData.documents.files}
              />
            </div>
          </div>
          {/* Edit modal - rendered here and controlled by state */}
          <EditEmployeeModal
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            initialData={employeeData}
          />
        </main>
      </div>
    </div>
  );
};

export default EmployeeDetailsPage;