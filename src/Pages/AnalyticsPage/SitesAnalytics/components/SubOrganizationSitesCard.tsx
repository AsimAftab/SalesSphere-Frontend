import React from 'react';
import InfoCard from '../../../../components/ui/SharedCards/InfoCard';
import type { SubOrgSiteCount } from '../../../../api/sitesDashboardService';
import { Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../../../components/ui/EmptyState/EmptyState';

interface SubOrganizationSitesCardProps {
    data?: SubOrgSiteCount[];
}

const SubOrganizationSitesCard: React.FC<SubOrganizationSitesCardProps> = ({ data = [] }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    return (
        <InfoCard
            title="Sub-Organization Sites"
            scrollableRef={scrollRef}
            showScrollIndicator={data.length > 5}
        >
            <div className="h-full flex flex-col relative">
                {/* Header Row */}
                <div className="flex justify-between items-center py-3 px-3 border-b border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sub Organization</span>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-8">{data.reduce((acc, curr) => acc + curr.siteCount, 0)}</span>
                </div>

                <div ref={scrollRef} className="overflow-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {data.length === 0 ? (
                        <EmptyState
                            title="No Sub-Organizations"
                            description="No sub-organization data available."
                            icon={<Building2 className="w-10 h-10 text-blue-200" />}
                        />
                    ) : (
                        <div className="pb-2">
                            {data.map((item, index) => (
                                <Link
                                    key={item.subOrganization}
                                    to={`/sites?subOrg=${encodeURIComponent(item.subOrganization)}`}
                                    className="flex justify-between items-center py-3 px-3 rounded-lg hover:bg-blue-100 transition-all duration-300 group border-b border-gray-100 last:border-0 hover:shadow-sm hover:pl-4 cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${index % 2 === 0 ? 'bg-blue-400 group-hover:bg-blue-600' : 'bg-indigo-400 group-hover:bg-indigo-600'}`}></div>
                                        <span className="font-medium text-gray-700 text-sm capitalize group-hover:text-blue-800 transition-colors">{item.subOrganization}</span>
                                    </div>
                                    <div className="flex items-center gap-2 relative z-10">
                                        <span className="font-bold text-gray-900 text-sm bg-gray-100 px-2.5 py-0.5 rounded-full group-hover:bg-white group-hover:text-blue-700 transition-colors shadow-sm border border-transparent group-hover:border-blue-100">{item.siteCount}</span>
                                        <ChevronRight className="w-4 h-4 text-blue-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </InfoCard>
    );
};

export default SubOrganizationSitesCard;
