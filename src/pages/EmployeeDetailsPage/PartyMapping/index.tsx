import React from 'react';
import EntityMappingManager from '../Shared/EntityMapping/EntityMappingManager';
import { type TabCommonProps } from '../tabs.config';

const PartyMapping: React.FC<TabCommonProps> = ({ employee }) => {
    return (
        <EntityMappingManager
            entityType="party"
            employeeId={employee?._id || ''}
            title="Parties"
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            }
        />
    );
};

export default PartyMapping;
