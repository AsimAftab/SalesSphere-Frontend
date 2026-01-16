import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeOdometerDetails, type EmployeeOdometerDetails } from '../../../../api/odometerService';
import toast from 'react-hot-toast';

const useOdometerDetailsManager = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [details, setDetails] = useState<EmployeeOdometerDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchDetails = async () => {
            if (!employeeId) return;
            setLoading(true);
            try {
                const data = await getEmployeeOdometerDetails(employeeId);
                setDetails(data);
            } catch (error) {
                toast.error("Failed to load employee records");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [employeeId]);

    const handleBack = () => {
        navigate('/odometer');
    };

    const handleViewTripDetails = (tripId: string) => {
        navigate(`/odometer/trip/${tripId}`);
    };

    // Filter Logic
    const filteredRecords = details?.dailyRecords.filter(record => {
        if (!searchQuery) return true;
        // Simple filter: check if formatted date includes query
        const recordDateStr = new Date(record.date).toLocaleDateString();
        return recordDateStr.toLowerCase().includes(searchQuery.toLowerCase());
    }) || [];

    const displayDetails = details ? {
        ...details,
        dailyRecords: filteredRecords
    } : null;

    return {
        details: displayDetails,
        loading,
        searchQuery,
        actions: {
            setSearchQuery,
            handleBack,
            handleViewTripDetails
        }
    };
};

export default useOdometerDetailsManager;
