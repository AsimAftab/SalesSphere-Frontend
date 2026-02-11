import React from 'react';
import { motion } from 'framer-motion';
import AssignedList from './AssignedList';
import UnassignedSelector from './UnassignedSelector';
import { useEntityMapping, type EntityType } from './useEntityMapping';

interface EntityMappingManagerProps {
    entityType: EntityType;
    employeeId: string;
    title: string;
    icon: React.ReactNode;
}

const containerVariants = {
    hidden: { opacity: 1 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12 },
    },
};

const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 30 } },
};

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

    const filterPlaceholder = entityType === 'party' ? 'Party Type' : entityType === 'site' ? 'Sub-Organization' : 'All Types';

    const themeColors = entityType === 'party'
        ? { iconBg: 'from-blue-500 to-blue-600', iconShadow: 'shadow-blue-500/25', availableIconBg: 'from-blue-400 to-blue-500', availableIconShadow: 'shadow-blue-400/25', tagClasses: 'bg-blue-50 text-blue-600 border-blue-200', badgeClasses: 'text-blue-600 bg-blue-50' }
        : entityType === 'prospect'
            ? { iconBg: 'from-orange-500 to-orange-600', iconShadow: 'shadow-orange-500/25', availableIconBg: 'from-orange-400 to-orange-500', availableIconShadow: 'shadow-orange-400/25', tagClasses: 'bg-orange-50 text-orange-600 border-orange-200', badgeClasses: 'text-orange-600 bg-orange-50' }
            : { iconBg: 'from-emerald-500 to-emerald-600', iconShadow: 'shadow-emerald-500/25', availableIconBg: 'from-emerald-400 to-emerald-500', availableIconShadow: 'shadow-emerald-400/25', tagClasses: 'bg-emerald-50 text-emerald-600 border-emerald-200', badgeClasses: 'text-emerald-600 bg-emerald-50' };

    if (!employeeId) return <div>No employee ID provided</div>;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="h-full flex flex-col overflow-hidden"
        >
            {/* Panels */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 pb-4 overflow-y-auto md:overflow-hidden min-h-0">
                <motion.div variants={panelVariants} className="min-w-0 h-[500px] md:h-full overflow-hidden">
                    <AssignedList
                        items={assignedItems}
                        onUnassign={(id) => unassignEntities([id])}
                        title={title}
                        icon={icon}
                        isLoading={isLoading}
                        iconBg={themeColors.iconBg}
                        iconShadow={themeColors.iconShadow}
                        tagClasses={themeColors.tagClasses}
                        badgeClasses={themeColors.badgeClasses}
                    />
                </motion.div>

                <motion.div variants={panelVariants} className="min-w-0 h-[550px] md:h-full overflow-hidden">
                    <UnassignedSelector
                        items={availableItems}
                        onAssign={assignEntities}
                        title={title}
                        icon={icon}
                        isLoading={isLoading || isAssigning}
                        filterOptions={filterOptions}
                        selectedFilter={selectedFilter}
                        onFilterChange={setFilter}
                        filterPlaceholder={filterPlaceholder}
                        iconBg={themeColors.availableIconBg}
                        iconShadow={themeColors.availableIconShadow}
                        tagClasses={themeColors.tagClasses}
                        badgeClasses={themeColors.badgeClasses}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EntityMappingManager;
