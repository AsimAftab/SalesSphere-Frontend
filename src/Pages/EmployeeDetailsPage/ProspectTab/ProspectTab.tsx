import React from 'react';

const ProspectTab: React.FC = () => {
    return (
        <div className="h-full overflow-y-auto py-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Prospect Mapping</h2>
                <p className="text-gray-500">Prospect details associated with this employee will be displayed here.</p>
            </div>
        </div>
    );
};

export default ProspectTab;
