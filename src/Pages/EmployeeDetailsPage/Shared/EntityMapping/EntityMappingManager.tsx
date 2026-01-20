import React from 'react';
import AssignedList from './AssignedList';
import UnassignedSelector from './UnassignedSelector';
import { useEntityMapping, type EntityType } from './useEntityMapping';

interface EntityMappingManagerProps {
    entityType: EntityType;
    employeeId: string;
    title: string;
    icon: React.ReactNode;
}

const EntityMappingManager: React.FC<EntityMappingManagerProps> = ({
    entityType,
    employeeId,
    title,
    icon
}) => {
    const {
        assignedItems,
        availableItems,
        isLoading,
        isAssigning,
        assignEntities,
        unassignEntities,
        filterOptions,
        selectedFilter,
        setFilter
    } = useEntityMapping({ entityType, employeeId });

    if (!employeeId) return <div>No employee ID provided</div>;

    return (
        <div className="h-full flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
            {/* Left Side: Assigned (Viewing & Removing) */}
            <div className="flex-1 min-w-0 h-full overflow-hidden flex flex-col">
                <AssignedList
                    items={assignedItems}
                    onUnassign={(id) => unassignEntities([id])}
                    title={title}
                    icon={icon}
                />
            </div>

            {/* Right Side: Available (Searching & Adding) */}
            <div className="flex-1 min-w-0 h-full overflow-hidden">
                <UnassignedSelector
                    items={availableItems}
                    onAssign={assignEntities}
                    title={title}
                    isLoading={isLoading || isAssigning}
                    // Filter Props
                    filterOptions={filterOptions}
                    selectedFilter={selectedFilter}
                    onFilterChange={setFilter}
                />
            </div>
        </div>
    );
};

export default EntityMappingManager;
