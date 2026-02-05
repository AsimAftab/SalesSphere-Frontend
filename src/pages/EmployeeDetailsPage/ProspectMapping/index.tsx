import React from 'react';
import EntityMappingManager from '../Shared/EntityMapping/EntityMappingManager';
import { type TabCommonProps } from '../tabs.config';
import prospectsIcon from '@/assets/images/icons/prospects-icon.svg';

const ProspectMapping: React.FC<TabCommonProps> = ({ employee }) => {
    return (
        <EntityMappingManager
            entityType="prospect"
            employeeId={employee?._id || ''}
            title="Prospects"
            icon={<img src={prospectsIcon} className="w-5 h-5" alt="" />}
        />
    );
};

export default ProspectMapping;
