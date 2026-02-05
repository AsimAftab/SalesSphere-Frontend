import React from 'react';
import EntityMappingManager from '../Shared/EntityMapping/EntityMappingManager';
import { type TabCommonProps } from '../tabs.config';
import partiesIcon from '@/assets/images/icons/parties-icon.svg';

const PartyMapping: React.FC<TabCommonProps> = ({ employee }) => {
    return (
        <EntityMappingManager
            entityType="party"
            employeeId={employee?._id || ''}
            title="Parties"
            icon={<img src={partiesIcon} className="w-5 h-5" alt="" />}
        />
    );
};

export default PartyMapping;
