import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import type { BeatPlanPermissions } from '../../../hooks/useBeatPlanPermissions';

interface BeatListSkeletonProps {
    permissions?: BeatPlanPermissions;
}

const BeatListSkeleton: React.FC<BeatListSkeletonProps> = ({ permissions }) => {
    const showViewDetails = permissions?.canViewTemplateDetails ?? true;
    const showAssign = permissions?.canAssign ?? true;
    const showActions = (permissions?.canUpdateTemplate || permissions?.canDeleteTemplate) ?? true;
    const showCreate = permissions?.canCreateTemplate ?? true;
    const showExport = permissions?.canExportPdf ?? true;

    return (
        <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-500">

            {/* Header Title (left) , search bar and create button (right) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Skeleton width={190} height={32} className="mb-2" />
                    <Skeleton width={150} height={20} />
                </div>
                <div className="flex justify-end items-center gap-3 w-full">
                    <Skeleton height={40} width={280} borderRadius={999} />
                    <Skeleton height={40} width={42} borderRadius={8} />
                    {showExport && <Skeleton height={40} width={42} borderRadius={8} />}
                    {showCreate && <Skeleton height={40} width={160} borderRadius={8} />}
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="text-sm">
                            <tr>
                                <th className="px-5 py-4 text-left"><Skeleton width={40} height={16} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={150} height={16} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={80} height={16} /></th>
                                <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>
                                {showViewDetails && <th className="px-5 py-4 text-left"><Skeleton width={120} height={16} /></th>}
                                {showAssign && <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>}
                                <th className="px-5 py-4 text-left"><Skeleton width={100} height={16} /></th>
                                {showActions && <th className="px-5 py-4 text-left"><Skeleton width={60} height={16} /></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {[...Array(8)].map((_, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-5 py-4"><Skeleton width={30} height={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={180} height={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={60} height={20} /></td>
                                    <td className="px-5 py-4"><Skeleton width={100} height={20} /></td>
                                    {showViewDetails && <td className="px-5 py-4"><Skeleton width={140} height={20} /></td>}
                                    {showAssign && <td className="px-5 py-4"><Skeleton width={140} height={20} /></td>}
                                    <td className="px-5 py-4"><Skeleton width={90} height={32} borderRadius={6} /></td>
                                    {showActions && (
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2">
                                                <Skeleton width={32} height={32} borderRadius={8} />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Skeleton */}
            <div className="md:hidden space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 space-y-3">
                            {/* Header: Serial # + Name */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <Skeleton width={60} height={12} className="mb-1" />
                                    <Skeleton width={180} height={20} />
                                </div>
                            </div>

                            {/* Grid: Stops & Created By */}
                            <div className="grid grid-cols-2 gap-y-3 pt-2 border-t border-gray-50 mt-2">
                                <div>
                                    <Skeleton width={70} height={12} className="mb-1" />
                                    <Skeleton width={40} height={16} />
                                </div>
                                <div>
                                    <Skeleton width={70} height={12} className="mb-1" />
                                    <Skeleton width={90} height={16} />
                                </div>
                                <div className="col-span-2">
                                    <Skeleton width={70} height={12} className="mb-1" />
                                    <Skeleton width={100} height={16} />
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-100">
                            {(showViewDetails || showActions) && (
                                <div className="flex divide-x divide-gray-100">
                                    {showViewDetails && (
                                        <div className="p-2.5 flex justify-center flex-1">
                                            <Skeleton width={90} height={20} />
                                        </div>
                                    )}
                                    {showActions && (
                                        <div className="p-2.5 flex justify-center flex-1">
                                            <Skeleton width={70} height={20} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Assign Row */}
                            {showAssign && (
                                <div className="p-3 border-t border-gray-100">
                                    <Skeleton width="100%" height={24} />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BeatListSkeleton;
