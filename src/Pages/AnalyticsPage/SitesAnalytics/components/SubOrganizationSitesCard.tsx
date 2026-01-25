import React from 'react';
import InfoCard from '../../../../components/UI/shared_cards/InfoCard';
import type { SubOrgSiteCount } from '../../../../api/sitesDashboardService';
import { Building } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubOrganizationSitesCardProps {
    data?: SubOrgSiteCount[];
}

const SubOrganizationSitesCard: React.FC<SubOrganizationSitesCardProps> = ({ data = [] }) => {
    return (
        <InfoCard
            title="Sub-Organization Sites"
            subtitle="Distribution of sites across sub-organizations"
        >
            <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                {data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-500">
                        <Building className="w-8 h-8 mb-2 opacity-50" />
                        <p>No sub-organization data available</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data.map((item) => (
                            <Link
                                key={item.subOrganization}
                                to={`/sites?subOrg=${encodeURIComponent(item.subOrganization)}`}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-white rounded-md shadow-sm group-hover:bg-blue-50 transition-colors">
                                        <Building className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-700 group-hover:text-blue-700 transition-colors">{item.subOrganization}</span>
                                </div>
                                <div className="flex items-center bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-sm group-hover:border-blue-200 transition-colors">
                                    <span className="text-sm font-bold text-gray-800">{item.siteCount}</span>
                                    <span className="text-xs text-gray-500 ml-1">sites</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </InfoCard>
    );
};

export default SubOrganizationSitesCard;
