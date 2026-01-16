import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTripDetailsByDate, deleteTrip, type TripOdometerDetails } from '../../../../api/odometerService';
import toast from 'react-hot-toast';

const useTripDetailsManager = () => {
    const { tripId } = useParams<{ tripId: string }>(); // This is the daily record ID passed in the URL
    const [trips, setTrips] = useState<TripOdometerDetails[]>([]);
    const [activeTripId, setActiveTripId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            if (!tripId) return;
            setLoading(true);
            try {
                // tripId here corresponds to the daily record ID
                const data = await getTripDetailsByDate(tripId);
                setTrips(data);
                if (data.length > 0) {
                    setActiveTripId(data[0].id);
                }
            } catch (error) {
                toast.error("Failed to load trip details");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [tripId]);

    const deleteTripRecord = async (id: string) => {
        try {
            await deleteTrip(id);
            toast.success("Trip deleted successfully");

            // Refresh local state
            const remainingTrips = trips.filter(t => t.id !== id);
            setTrips(remainingTrips);

            if (remainingTrips.length > 0) {
                if (activeTripId === id) {
                    setActiveTripId(remainingTrips[0].id);
                }
            } else {
                setActiveTripId(null);
            }

        } catch (error) {
            toast.error("Failed to delete trip");
        }
    };

    const activeTrip = trips.find(t => t.id === activeTripId) || null;

    return {
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        loading,
        deleteTrip: deleteTripRecord
    };
};

export default useTripDetailsManager;
