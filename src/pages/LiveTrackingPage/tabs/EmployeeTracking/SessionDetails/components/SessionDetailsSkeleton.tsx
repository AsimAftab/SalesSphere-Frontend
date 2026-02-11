import React from 'react';
import Sidebar from '@/components/layout/Sidebar/Sidebar';

const SessionDetailsSkeleton: React.FC = () => {
    return (
        <Sidebar>
            <div className="flex flex-col h-[calc(100vh-10rem)] bg-gray-50 overflow-hidden animate-pulse">
                {/* Header Skeleton */}
                <div className="flex-shrink-0 bg-white p-4 border-b border-gray-200 mb-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                    </div>
                    <div className="ml-auto w-24 h-8 bg-gray-200 rounded-full"></div>
                </div>

                {/* Main Content Grid */}
                <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-4 p-4 pt-0 min-h-0 overflow-hidden">

                    {/* Left: Map Skeleton */}
                    <div className="bg-gray-200 rounded-lg shadow h-full w-full"></div>

                    {/* Right: Sidebar Skeleton */}
                    <aside className="flex flex-col gap-3 min-h-0 overflow-hidden">

                        {/* Stats Skeleton (Grid 3 cols) */}
                        <div className="flex-shrink-0 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="grid grid-cols-3 gap-4 divide-x divide-gray-100">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex flex-col items-center justify-center px-2 space-y-2">
                                        <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                        <div className="w-12 h-5 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legend Skeleton (Grid 2 cols) */}
                        <div className="flex-shrink-0 bg-white p-4 rounded-lg shadow-sm border-2 border-gray-100">
                            <div className="h-3 w-20 bg-gray-200 rounded mb-4"></div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full bg-gray-200"></div>
                                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Timeline Skeleton */}
                        <div className="flex-1 min-h-0 bg-white rounded-lg shadow flex flex-col p-4">
                            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                            </div>
                            <div className="space-y-6 overflow-hidden flex-1 px-2">
                                {[1, 2, 3, 4, 5,6,7].map((i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {/* Line */}
                                        {i !== 5 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[2px] bg-gray-100"></div>}

                                        {/* Marker */}
                                        <div className="z-10 flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 border-2 border-white shadow-sm"></div>

                                        {/* Content */}
                                        <div className="flex-1 space-y-2 pt-0.5">
                                            <div className="flex justify-between items-start">
                                                <div className="h-3 w-3/4 bg-gray-200 rounded"></div>
                                                <div className="h-3 w-12 bg-gray-100 rounded"></div>
                                            </div>
                                            <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </main>
            </div>
        </Sidebar>
    );
};

export default SessionDetailsSkeleton;
