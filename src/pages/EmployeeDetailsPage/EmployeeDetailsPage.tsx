import React, { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar/Sidebar';
import EmployeeTabNavigation from './EmployeeTabNavigation';
import { useEmployee, useAttendance } from './hooks/useEmployee';
import { useEmployeeOrders } from './hooks/useEmployeeOrders'; // Import Order Hook
import { useTabSecurity } from './hooks/useTabSecurity';
import { type TabCommonProps } from './tabs.config';
import { ErrorBoundary } from '@/components/ui';

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

    const isMappingTab = ['party-mapping', 'prospect-mapping', 'site-mapping'].includes(activeTabId);

    // Common props passed to all tabs (they can ignore if not needed)
    const tabProps: TabCommonProps = {
        employee: employee || null,
        attendanceSummary: attendanceSummary || null,
        loading: isLoading,
        error: errorString
    };

    return (
        <Sidebar>
            <div className={`flex flex-col ${isMappingTab ? 'h-[calc(100vh-9rem)] overflow-hidden' : 'min-h-0'}`}>
                <div className="-mx-4 sm:-mx-6 lg:-mx-8">
                    <EmployeeTabNavigation
                        activeTab={activeTabId}
                        onTabChange={setActiveTabId}
                        allowedTabs={allowedTabs}
                        loading={isLoading || !employee}
                        rightContent={activeTabId === 'orders' ? (
                            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold border border-secondary/20 shadow-sm whitespace-nowrap">
                                Total Orders: {totalOrders}
                            </span>
                        ) : null}
                    />
                </div>

                {/* Tab Content Area - Scroll behavior delegated to tabs */}
                <div className={`flex-1 overflow-x-hidden ${isMappingTab ? 'overflow-hidden' : 'min-h-[400px]'}`}>
                    <ErrorBoundary>
                        <Suspense fallback={
                            isMappingTab ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 pb-4 h-full">
                                    {[0, 1].map(col => (
                                        <div key={col} className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                            <div className="px-5 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-b from-gray-50/80 to-white">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
                                                        <div className="space-y-2">
                                                            <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
                                                            <div className="h-3 w-24 bg-gray-100 rounded-md animate-pulse" />
                                                        </div>
                                                    </div>
                                                    <div className="h-10 w-48 bg-gray-200 rounded-full animate-pulse" />
                                                </div>
                                            </div>
                                            <div className="flex-1 px-4 py-3 bg-gray-50/60 space-y-2.5">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <div key={i} className="flex items-center gap-3.5 p-3.5 rounded-xl border border-gray-100 bg-white" style={{ opacity: 1 - i * 0.15 }}>
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse shrink-0" />
                                                        <div className="flex-1 space-y-2">
                                                            <div className="h-4 w-3/5 bg-gray-200 rounded-md animate-pulse" />
                                                            <div className="h-3 w-2/5 bg-gray-100 rounded-md animate-pulse" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="px-4 py-3 border-t border-gray-100 bg-white">
                                                <div className="h-8 w-full bg-gray-100 rounded-lg animate-pulse" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex justify-center items-center h-64 text-gray-500">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mr-3"></div>
                                    Loading tab...
                                </div>
                            )
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