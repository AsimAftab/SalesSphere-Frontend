
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const PartyCollectionsSkeleton = () => (
    <div className="bg-white rounded-xl border border-gray-200 p-12 flex justify-center">
        <div className="text-center space-y-4">
            <Skeleton circle height={64} width={64} />
            <Skeleton height={20} width={200} />
        </div>
    </div>
);
