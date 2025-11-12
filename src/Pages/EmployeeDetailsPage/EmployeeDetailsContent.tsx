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

import { motion } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface DocumentFile {
    name: string;
    fileUrl: string;
    size: string;
    date: string; 
}


interface FormattedAttendance {
    percentage: number;
    stats: { value: number; label: string; color: string }[];
    monthYear: string; 
    totalWorkingDays: number;
}

interface EmployeeDetailsContentProps {
    employee: Employee | null;
    loading: boolean;
    error: string | null;
    onEdit: () => void;
    onDelete: () => void;
    attendanceSummary: FormattedAttendance | null; 
}

const containerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const EmployeeDetailsSkeleton: React.FC = () => {
    return (
        <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
            <div className="relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Skeleton circle width={36} height={36} />
                        <Skeleton width={200} height={28} />
                    </div>
                    <div className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:space-x-4">
                        <Skeleton height={40} width={180} borderRadius={8} />
                        <Skeleton height={40} width={160} borderRadius={8} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <div className="flex items-center gap-4">
                                <Skeleton circle width={80} height={80} />
                                <div className="flex-1">
                                    <Skeleton width="60%" height={24} />
                                    <Skeleton width="40%" />
                                </div>
                            </div>
                        </div>
                       
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <Skeleton width="30%" height={20} className="mb-4" />
                            <Skeleton count={7} />
                        </div>
                       
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <Skeleton width="40%" height={20} className="mb-4" />
                            <div className="flex items-center gap-6">
                                <Skeleton circle width={100} height={100} />
                                <div className="flex-1">
                                    <Skeleton count={3} />
                                </div>
                            </div>
                        </div>
                    </div>
                  
                    <div className="lg:col-span-1 space-y-6">
                        
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <Skeleton width="50%" height={20} className="mb-4" />
                            <Skeleton count={3} />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <Skeleton width="40%" height={20} className="mb-4" />
                            <Skeleton count={4} />
                        </div>
                    </div>
                </div>
            </div>
        </SkeletonTheme>
    );
};


const EmployeeDetailsContent: React.FC<EmployeeDetailsContentProps> = ({
    employee,
    loading,
    error,
    onEdit,
    onDelete,
    attendanceSummary 
}) => {

  
    if (loading) {
        return <EmployeeDetailsSkeleton />;
    }
    
    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }
    if (!employee) {
        return <div className="text-center p-10 text-gray-500">Employee not found.</div>;
    }

    
    const isAdmin = employee.role?.toLowerCase() === 'admin';

    
    const infoDetails = [
        { label: 'Gender', value: employee.gender || 'N/A' },
        { label: 'Age', value: employee.age ? `${employee.age} years` : 'N/A' },
        { label: 'Date of Birth', value: employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
        { label: 'Phone Number', value: employee.phone || 'N/A' },
        { label: 'PAN Number', value: employee.panNumber || 'N/A' },
        { label: 'Citizenship Number', value: employee.citizenshipNumber || 'N/A' },
        { label: 'Date Joined', value: employee.dateJoined ? new Date(employee.dateJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/F' },
    ];

    const contactDetails = [
        { label: 'Email Address', value: employee.email },
        { label: 'Phone Number', value: employee.phone || 'N/A' },
        { label: 'Address', value: employee.address || 'N/A' },
    ];

    const documentFiles: DocumentFile[] = (employee.documents || []).map(doc => ({
        name: doc.fileName,
        fileUrl: doc.fileUrl,
        size: 'N/A', 
        date: doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-CA') : 'N/A', 
    }));

    return (
        <motion.div 
            className="relative"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
           
            <motion.div 
                className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4"
                variants={itemVariants}
            >
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
            </motion.div>
            
         
            <motion.div 
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                variants={itemVariants}
            >
                <div className="lg:col-span-2 space-y-6">
                    <ProfileHeaderCard
                        name={employee.name}
                        title={employee.role}
                       
                        imageUrl={employee.avatarUrl || `https://placehold.co/150x150/e0e0e0/ffffff?text=${employee.name ? employee.name.charAt(0) : 'E'}`}
                    />
                    <EmployeeInfoCard details={infoDetails} />
                    {isAdmin ? (
                        <div className="bg-white p-6 rounded-lg shadow-md ">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                Administrative Profile: Attendance Exempt
                            </h3>
                            <p className="text-red-600">
                                Attendance data is not tracked or recorded for roles designated as Administrative (Admin).
                            </p>
                        </div>
                    ) : (
                        <AttendanceSummaryCard
                            percentage={attendanceSummary?.percentage ?? 0}
                            stats={attendanceSummary?.stats ?? []}
                            monthYear={attendanceSummary?.monthYear ?? 'Current Month'}
                            totalWorkingDays={attendanceSummary?.totalWorkingDays ?? 0}
                        />
                    )}
                   
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
            </motion.div>
        </motion.div>
    );
};

export default EmployeeDetailsContent;