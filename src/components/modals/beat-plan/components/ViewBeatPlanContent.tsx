import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building, Users } from 'lucide-react';

interface ViewBeatPlanContentProps {
    activeTab: 'parties' | 'sites' | 'prospects';
    setActiveTab: (tab: any) => void;
    tabs: ReadonlyArray<{
        id: string;
        label: string;
        icon: React.ElementType;
        count: number;
        data: any[];
    }>;
    activeData: any[];
}

const ViewBeatPlanContent: React.FC<ViewBeatPlanContentProps> = ({
    activeTab,
    setActiveTab,
    tabs,
    activeData
}) => {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-700">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors relative ${activeTab === tab.id
                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full text-xs">
                            {tab.count}
                        </span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-black/20">
                {activeData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                        <p>No {activeTab} added to this beat plan.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activeData.map((item: any, idx: number) => (
                            <div key={item._id || idx} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-start gap-3">
                                <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500">
                                    {activeTab === 'parties' && <Building className="w-4 h-4" />}
                                    {activeTab === 'sites' && <MapPin className="w-4 h-4" />}
                                    {activeTab === 'prospects' && <Users className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                        {item.partyName || item.siteName || item.prospectName}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {item.ownerName}
                                    </p>
                                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {item.location?.address || 'No Address'}
                                        </span>
                                    </div>
                                </div>
                                {item.contact?.phone && (
                                    <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                                        {item.contact.phone}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewBeatPlanContent;
