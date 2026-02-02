
/**
 * SkeletonPulse - Reusable skeleton loading animation component
 */
const SkeletonPulse = ({ className }: { className: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const PartyCollectionsSkeleton = () => {
    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header Skeleton */}
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse px-1" />

            <div className="relative w-full space-y-4">
                {/* Desktop Table Skeleton */}
                <div className="hidden md:block lg:col-span-3 bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {/* Matches PartyCollectionsTable columns: S.NO., Date, Payment Mode, Amount, Created By, View Details */}
                                    <th className="px-5 py-3 text-left"><SkeletonPulse className="h-4 w-12" /></th>
                                    <th className="px-5 py-3 text-left"><SkeletonPulse className="h-4 w-32" /></th>
                                    <th className="px-5 py-3 text-left"><SkeletonPulse className="h-4 w-32" /></th>
                                    <th className="px-5 py-3 text-left"><SkeletonPulse className="h-4 w-24" /></th>
                                    <th className="px-5 py-3 text-left"><SkeletonPulse className="h-4 w-40" /></th>
                                    <th className="px-5 py-3 text-left"><SkeletonPulse className="h-4 w-24" /></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[...Array(10)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-5 py-4"><SkeletonPulse className="h-4 w-8" /></td>
                                        <td className="px-5 py-4"><SkeletonPulse className="h-4 w-28" /></td>
                                        <td className="px-5 py-4"><SkeletonPulse className="h-4 w-24" /></td>
                                        <td className="px-5 py-4"><SkeletonPulse className="h-4 w-20" /></td>
                                        <td className="px-5 py-4"><SkeletonPulse className="h-4 w-32" /></td>
                                        <td className="px-5 py-4"><SkeletonPulse className="h-4 w-24 text-secondary/50" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile List Skeleton (Matches PartyCollectionsMobileList) */}
                <div className="md:hidden space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <SkeletonPulse className="h-3 w-12" /> {/* Date Label */}
                                    <SkeletonPulse className="h-5 w-32" /> {/* Date Value */}
                                </div>
                                <div className="space-y-1 items-end flex flex-col">
                                    <SkeletonPulse className="h-3 w-16" /> {/* Created By Label */}
                                    <SkeletonPulse className="h-5 w-24" /> {/* Created By Value */}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <div className="space-y-1">
                                    <SkeletonPulse className="h-3 w-16" /> {/* Mode Label */}
                                    <SkeletonPulse className="h-4 w-24" /> {/* Mode Value */}
                                </div>
                                <div className="space-y-1">
                                    <SkeletonPulse className="h-3 w-16" /> {/* Amount Label */}
                                    <SkeletonPulse className="h-4 w-20" /> {/* Amount Value */}
                                </div>
                            </div>

                            <div className="pt-2 border-t border-gray-50 mt-2">
                                <SkeletonPulse className="h-9 w-full rounded-lg" /> {/* View Details Button */}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
