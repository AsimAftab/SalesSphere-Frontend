import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EntityMappingManager from '../Shared/EntityMapping/EntityMappingManager';
import { type TabCommonProps } from '../tabs.config';
import prospectsIcon from '@/assets/images/icons/prospects-icon.svg';

const ProspectMapping: React.FC<TabCommonProps> = ({ employee }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 sm:gap-4 pt-4 px-1">
                <Link to="/employees" className="p-2 rounded-full hover:bg-gray-200 transition-colors shrink-0">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Link>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                    {employee?.name || 'Employee'} - Prospect Mapping
                </h1>
            </div>
            <EntityMappingManager
                entityType="prospect"
                employeeId={employee?._id || ''}
                title="Prospects"
                icon={<img src={prospectsIcon} className="w-5 h-5" alt="" />}
            />
        </div>
    );
};

export default ProspectMapping;
