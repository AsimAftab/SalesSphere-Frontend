import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar/Sidebar';
import EmployeeTabNavigation from './EmployeeTabNavigation';
import { useEmployee, useAttendance } from './hooks/useEmployee';
import { useEmployeeOrders } from './hooks/useEmployeeOrders'; // Import Order Hook
import { useTabSecurity } from './hooks/useTabSecurity';
import { type TabCommonProps } from './tabs.config';
import ErrorBoundary from '../../components/UI/ErrorBoundary/ErrorBoundary';

const EmployeeDetailsPage: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();

    // Security Logic Hook
    const { allowedTabs, activeTabId, setActiveTabId } = useTabSecurity();

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

    // Fetch orders here just for the count in the tab bar (cached by React Query)
    const { totalOrders } = useEmployeeOrders(employeeId);

    const isLoading = isEmployeeLoading || isAttendanceLoading;
    const errorString = employeeError
        ? (employeeError instanceof Error ? employeeError.message : 'Unknown employee loading error')
        : attendanceError
            ? (attendanceError instanceof Error ? attendanceError.message : 'Failed to load attendance summary.')
            : null;

    // Resolve Active Component
    const ActiveTabConfig = allowedTabs.find(t => t.id === activeTabId);
    const ActiveComponent = ActiveTabConfig?.component;

    // Common props passed to all tabs (they can ignore if not needed)
    const tabProps: TabCommonProps = {
        employee: employee || null,
        attendanceSummary: attendanceSummary || null,
        loading: isLoading,
        error: errorString
    };

    return (
        <Sidebar>
            <div className="flex flex-col h-[calc(100vh-9rem)] overflow-hidden">
                <EmployeeTabNavigation
                    activeTab={activeTabId}
                    onTabChange={setActiveTabId}
                    allowedTabs={allowedTabs}
                    rightContent={activeTabId === 'orders' ? (
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold border border-secondary/20 shadow-sm animate-in fade-in zoom-in duration-300">
                            Total Orders: {totalOrders}
                        </span>
                    ) : null}
                />

                {/* Tab Content Area - Scroll behavior delegated to tabs */}
                <div className="flex-1 overflow-hidden relative">
                    <ErrorBoundary>
                        <Suspense fallback={
                            <div className="flex justify-center items-center h-64 text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mr-3"></div>
                                Loading tab...
                            </div>
                        }>
                            {ActiveComponent ? (
                                <ActiveComponent {...tabProps} />
                            ) : (
                                <div className="text-center text-gray-500 mt-10">
                                    Tab not found or access denied.
                                </div>
                            )}
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </Sidebar>
    );
};

export default EmployeeDetailsPage;