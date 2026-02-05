import React from 'react';
import EntityMappingManager from '../Shared/EntityMapping/EntityMappingManager';
import { type TabCommonProps } from '../tabs.config';
import sitesIcon from '@/assets/images/icons/sites-icon.svg';

const SiteMapping: React.FC<TabCommonProps> = ({ employee }) => {
    return (
        <EntityMappingManager
            entityType="site"
            employeeId={employee?._id || ''}
            title="Sites"
            icon={<img src={sitesIcon} className="w-5 h-5" alt="" />}
        />
    );
};

export default SiteMapping;
