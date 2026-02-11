import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { type TabCommonProps } from '../tabs.config';
import { useEmployeeCollections } from '../hooks/useEmployeeCollections';
import EmployeeCollectionsTable from './components/EmployeeCollectionsTable';
import EmployeeCollectionsMobileList from './components/EmployeeCollectionsMobileList';
import collectionIcon from '@/assets/images/icons/collection.svg';
import { Pagination, EmptyState, TableSkeleton, MobileCardSkeleton } from '@/components/ui';

const CollectionsTab: React.FC<TabCommonProps> = ({ employee }) => {
    const {
        collections,
        totalCollections,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        isLoading,
        error,
    } = useEmployeeCollections(employee?._id);

    // Header Component
    const TabHeader = () => (
        <div className="flex items-center gap-4 mb-6">
            <Link to="/employees" className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
                {employee?.name || 'Employee'} - Collections List
            </h1>
        </div>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                <TabHeader />
                <div className="relative w-full space-y-4">
                    {/* Desktop Table Skeleton */}
                    <TableSkeleton
                        rows={10}
                        columns={[
                            { width: 120, type: 'text' },  // Date
                            { width: 150, type: 'text' },  // Party Name
                            { width: 120, type: 'text' },  // Payment Mode
                            { width: 100, type: 'text' },  // Amount
                        ]}
                        showSerialNumber={true}
                        showCheckbox={false}
                        hideOnMobile={true}
                    />

                    {/* Mobile Card Skeleton */}
                    <MobileCardSkeleton
                        cards={4}
                        config={{
                            showCheckbox: false,
                            showAvatar: false,
                            detailRows: 2,
                            detailColumns: 2,
                            showAction: true,
                            actionCount: 1,
                            showBadge: true,
                            badgeCount: 1,
                        }}
                        showOnlyMobile={true}
                    />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                <TabHeader />
                <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error loading collections: {error}</div>
            </div>
        );
    }

    if (totalCollections === 0) {
        return (
            <div className="flex flex-col h-full py-4 md:py-6 space-y-4">
                <TabHeader />
                <EmptyState
                    title="No Collections Found"
                    description={`${employee?.name || 'Employee'} has not recorded any collections yet.`}
                    icon={
                        <img
                            src={collectionIcon}
                            alt="No Collections"
                            className="w-12 h-12"
                        />
                    }
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full py-4 md:py-6 space-y-4 overflow-y-auto">
            <TabHeader />
            <div className="relative w-full space-y-4">
                {/* Desktop View */}
                <EmployeeCollectionsTable
                    collections={collections}
                    startIndex={(currentPage - 1) * itemsPerPage}
                    employeeId={employee?._id}
                    employeeName={employee?.name}
                />

                {/* Mobile View */}
                <EmployeeCollectionsMobileList
                    collections={collections}
                    employeeId={employee?._id}
                    employeeName={employee?.name}
                />

                <Pagination
                    currentPage={currentPage}
                    totalItems={totalCollections}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    className="w-full"
                />
            </div>
        </div>
    );
};

export default CollectionsTab;
