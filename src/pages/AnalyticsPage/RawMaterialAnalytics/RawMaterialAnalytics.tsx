import React from 'react';
import { Package } from 'lucide-react';
import { EmptyState } from '@/components/ui';

const RawMaterialAnalytics: React.FC = () => {
    return (
        <div className="h-full w-full p-6">
            <h2 className="text-2xl font-bold mb-6">Raw & Material Analytics</h2>
            <EmptyState
                title="Raw & Material Analytics Coming Soon"
                description="This feature is currently under development."
                icon={<Package className="w-16 h-16 text-gray-400" />}
            />
        </div>
    );
};

export default RawMaterialAnalytics;
