import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EmployeeTabNavigation from './EmployeeTabNavigation';
import DetailsTab from './DetailsTab/DetailsTab';
import OrdersTab from './OrdersTab/OrdersTab';
import CollectionsTab from './CollectionsTab/CollectionsTab';
import MappingTab from './MappingTab/MappingTab';
import { useEmployee, useAttendance } from './hooks/useEmployee';

const EmployeeDetailsPage: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const [activeTab, setActiveTab] = useState('details');

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // Shared Data Fetching
    const {
        employee,
        isEmployeeLoading,
        employeeError
    } = useEmployee(employeeId);

    const {
        attendanceSummary,
        isAttendanceLoading,
        attendanceError
    } = useAttendance(employeeId, currentMonth, currentYear);

    const isLoading = isEmployeeLoading || isAttendanceLoading;
    const errorString = employeeError
        ? (employeeError instanceof Error ? employeeError.message : 'Unknown employee loading error')
        : attendanceError
            ? (attendanceError instanceof Error ? attendanceError.message : 'Failed to load attendance summary.')
            : null;

    return (
        <Sidebar>
            <div className="flex flex-col min-h-screen">
                <EmployeeTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="p-6">
                    {activeTab === 'details' && (
                        <DetailsTab
                            employee={employee || null}
                            attendanceSummary={attendanceSummary || null}
                            loading={isLoading}
                            error={errorString}
                        />
                    )}
                    {activeTab === 'orders' && <OrdersTab />}
                    {activeTab === 'collections' && <CollectionsTab />}
                    {activeTab === 'mapping' && <MappingTab />}
                </div>
            </div>
        </Sidebar>
    );
};

export default EmployeeDetailsPage;