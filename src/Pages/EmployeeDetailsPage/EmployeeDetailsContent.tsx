import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button/Button';
import ProfileHeaderCard from '../../components/cards/EmployeeDetails_cards/ProfileHeaderCard';
import EmployeeInfoCard from '../../components/cards/EmployeeDetails_cards/EmployeeInfoCard';
import AttendanceSummaryCard from '../../components/cards/EmployeeDetails_cards/AttendanceSummaryCard';
import ContactInfoCard from '../../components/cards/EmployeeDetails_cards/ContactInfoCard';
import DocumentsCard from '../../components/cards/EmployeeDetails_cards/DocumentsCard';
import { type Employee } from '../../api/employeeService';

// Type for files passed to DocumentsCard
interface DocumentFile {
    name: string;
    fileUrl: string;
    size: string; // Added size prop
    date: string; 
}

interface EmployeeDetailsContentProps {
    employee: Employee | null;
    loading: boolean;
    error: string | null;
    onEdit: () => void;
    onDelete: () => void;
}

const EmployeeDetailsContent: React.FC<EmployeeDetailsContentProps> = ({
    employee,
    loading,
    error,
    onEdit,
    onDelete
}) => {

    if (loading) {
        return <div className="text-center p-10 text-gray-500">Loading Employee Details...</div>;
    }
    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }
    if (!employee) {
        return <div className="text-center p-10 text-gray-500">Employee not found.</div>;
    }

    // --- Data Transformation ---
    const infoDetails = [
        { label: 'Gender', value: employee.gender || 'N/A' },
        // Display the calculated age (virtual property)
        { label: 'Age', value: employee.age ? `${employee.age} years` : 'N/A' },
        // FIX: Display the actual dateOfBirth field
        { label: 'Date of Birth', value: employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
        { label: 'Phone Number', value: employee.phone || 'N/A' },
        { label: 'PAN Number', value: employee.panNumber || 'N/A' },
        { label: 'Citizenship Number', value: employee.citizenshipNumber || 'N/A' },
        { label: 'Date Joined', value: employee.dateJoined ? new Date(employee.dateJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
    ];

    const contactDetails = [
        { label: 'Email Address', value: employee.email },
        { label: 'Phone Number', value: employee.phone || 'N/A' },
        { label: 'Address', value: employee.address || 'N/A' },
    ];

    const documentFiles: DocumentFile[] = (employee.documents || []).map(doc => ({
        name: doc.fileName,
        fileUrl: doc.fileUrl,
        size: 'N/A', // Your backend model doesn't provide size, so we use a fallback
        date: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-CA') : 'N/A', 
    }));

    const mockAttendance = { // Placeholder data
        percentage: 78,
        stats: [ { value: 20, label: 'Present', color: 'bg-blue-500' }, { value: 1, label: 'Absent', color: 'bg-red-500' }, { value: 2, label: 'Half Day', color: 'bg-yellow-500' }, ],
    };

    return (
        <div className="flex-1 flex flex-col overflow-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/employees" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                        <ArrowLeftIcon className="h-5 w-5 text-gray-600" />
                    </Link>
                   <h1 className="text-2xl font-bold text-gray-800 text-center md:text-left">Employee Details</h1>
                </div>
               <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:space-x-4">
                    <Button variant="primary" onClick={onEdit} className="w-full">Edit Employee Details</Button>
                    <Button variant="outline" onClick={onDelete} className="w-full text-red-600 border-red-300 hover:bg-red-50 focus:ring-red-500">Delete Employee</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ProfileHeaderCard
                        name={employee.name}
                        title={employee.role}
                        imageUrl={employee.avatarUrl || `https://placehold.co/150x150/e0e0e0/ffffff?text=${employee.name.charAt(0)}`}
                    />
                    <EmployeeInfoCard details={infoDetails} />
                    <AttendanceSummaryCard
                        percentage={mockAttendance.percentage}
                        stats={mockAttendance.stats}
                    />
                </div>
            <div className="lg:col-span-1 space-y-6">
                    <ContactInfoCard
                        title="Contact Information"
                        contacts={contactDetails}
                    />
                    <DocumentsCard
                        title="Documents & Files"
                        files={documentFiles}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailsContent;