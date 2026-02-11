import { Skeleton, PageHeaderSkeleton } from '@/components/ui';

const PlanCardSkeleton = () => (
    <div className="border border-gray-200 bg-white flex flex-col rounded-2xl overflow-hidden h-full">
        <div className="p-4 flex items-start justify-between gap-3 border-b border-gray-100">
            <div className="flex items-center gap-3 w-full">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="flex flex-col flex-1 gap-2">
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
            </div>
        </div>
        <div className="pt-3 px-4 pb-2 flex flex-col gap-4 flex-1">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="flex flex-col flex-1 gap-1.5 pt-1">
                        <Skeleton className="h-3 w-1/4 rounded-sm" />
                        <Skeleton className="h-4 w-2/3 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
        <div className="px-4 py-3.5 border-t border-gray-100 flex items-center justify-between mt-auto">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-4 rounded-md" />
        </div>
    </div>
);

export const SubscriptionPlansSkeleton = () => (
    <div className="space-y-6">
        <PageHeaderSkeleton
            titleWidth={180}
            subtitleWidth={280}
            showSearch={true}
            showFilter={false}
            showExportPdf={false}
            showExportExcel={false}
            showCreate={true}
            createWidth={150}
        />

        {/* System Plans Section */}
        <div className="space-y-3">
            <Skeleton className="h-6 w-32 rounded" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <PlanCardSkeleton key={i} />
                ))}
            </div>
        </div>

        {/* Custom Plans Section */}
        <div className="space-y-3">
            <Skeleton className="h-6 w-36 rounded" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <PlanCardSkeleton key={i} />
                ))}
            </div>
        </div>
    </div>
);

export default SubscriptionPlansSkeleton;
