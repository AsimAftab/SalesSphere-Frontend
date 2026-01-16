import Button from '../../../../components/UI/Button/Button';

interface TripTabsProps {
    trips: { id: string; tripNumber: number }[];
    activeTripId: string;
    onTabChange: (id: string) => void;
}

const TripTabs: React.FC<TripTabsProps> = ({ trips, activeTripId, onTabChange }) => {
    return (
        <div className="w-full md:w-1/2 bg-white p-2 rounded-xl mb-6 flex overflow-x-auto gap-2 border border-gray-100 no-scrollbar">
            {trips.map((trip) => {
                const isActive = activeTripId === trip.id;
                return (
                    <Button
                        key={trip.id}
                        onClick={() => onTabChange(trip.id)}
                        variant={isActive ? 'primary' : 'outline'}
                        className={`
                            flex-1 min-w-[100px] rounded-lg text-sm font-semibold transition-all duration-200
                            ${isActive
                                ? 'bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-sm border border-[#1976D2]'
                                : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-gray-900'}
                        `}
                    >
                        Trip #{trip.tripNumber}
                    </Button>
                );
            })}
        </div>
    );
};

export default TripTabs;
