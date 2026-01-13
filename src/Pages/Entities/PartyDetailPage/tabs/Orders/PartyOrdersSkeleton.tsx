


export const PartyOrdersSkeleton = () => {
    return (
        <div className="flex flex-col h-full space-y-4">
            {/* Header Skeleton */}
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse px-1" />

            <div className="relative w-full space-y-4">
                {/* Desktop Table Skeleton */}
                <div className="hidden md:block bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    {[...Array(6)].map((_, i) => (
                                        <th key={i} className="px-5 py-3 text-left">
                                            <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[...Array(10)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-5 py-3"><div className="h-4 w-8 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-5 py-3"><div className="h-4 w-32 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-5 py-3"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-5 py-3"><div className="h-4 w-20 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-5 py-3"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-5 py-3"><div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile List Skeleton */}
                <div className="md:hidden space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
