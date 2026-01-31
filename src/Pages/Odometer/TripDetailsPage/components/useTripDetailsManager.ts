import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getTripDetailsByDate, deleteTrip, type TripOdometerDetails } from '../../../../api/odometerService';
import toast from 'react-hot-toast';

const useTripDetailsManager = () => {
    const { tripId } = useParams<{ tripId: string }>(); // This is the daily record ID passed in the URL
    const location = useLocation();
    const navigate = useNavigate();
    const [trips, setTrips] = useState<TripOdometerDetails[]>([]);
    const [activeTripId, setActiveTripId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // We derive this directly so it updates immediately when tripId becomes available
    const cachedCount = tripId ? sessionStorage.getItem(`trip_count_${tripId}`) : null;
    const initialTripCount = location.state?.tripCount ||
        (cachedCount ? parseInt(cachedCount, 10) : 0) ||
        3;

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
                    // Persist count for future refreshes
                    sessionStorage.setItem(`trip_count_${tripId}`, data.length.toString());

                    // Sync location state so refresh uses updated count
                    if (location.state?.tripCount !== data.length) {
                        navigate(location.pathname, {
                            replace: true,
                            state: { ...location.state, tripCount: data.length }
                        });
                    }
                }
            } catch (error) {
                toast.error("Failed to load trip details");
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- navigate/location are stable; adding them causes infinite loop
    }, [tripId]);

    const deleteTripRecord = useCallback(async (id: string) => {
        try {
            await deleteTrip(id);
            toast.success("Trip deleted successfully");

            // Refresh local state
            const remainingTrips = trips.filter((t: TripOdometerDetails) => t.id !== id);
            setTrips(remainingTrips);

            // Update cache to reflect deletion
            if (tripId) {
                const newCount = remainingTrips.length;
                sessionStorage.setItem(`trip_count_${tripId}`, newCount.toString());

                // Sync location state
                navigate(location.pathname, {
                    replace: true,
                    state: { ...location.state, tripCount: newCount }
                });
            }

            if (remainingTrips.length > 0) {
                if (activeTripId === id) {
                    setActiveTripId(remainingTrips[0].id);
                }
            } else {
                setActiveTripId(null);
                // Redirect to Odometer Details Page of the same employee
                if (tripId) {
                    const employeeId = tripId.split('|')[0];
                    if (employeeId) {
                        navigate(`/odometer/employee/${employeeId}`);
                    }
                }
            }

        } catch {
            toast.error("Failed to delete trip");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trips, activeTripId, tripId, navigate, location]);

    const activeTrip = trips.find((t: TripOdometerDetails) => t.id === activeTripId) || null;

    return {
        trips,
        activeTrip,
        activeTripId,
        setActiveTripId,
        loading,
        deleteTrip: deleteTripRecord,
        initialTripCount // Expose as initialTripCount for compatibility
    };
};

export default useTripDetailsManager;
