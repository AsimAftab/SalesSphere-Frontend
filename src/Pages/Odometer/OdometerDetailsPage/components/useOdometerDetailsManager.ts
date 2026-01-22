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

    const handleViewTripDetails = (tripId: string, tripCount: number) => {
        navigate(`/odometer/trip/${tripId}`, { state: { tripCount } });
    };

    // Filter Logic
    const filteredRecords = details?.dailyRecords.filter(record => {
        if (!searchQuery) return true;

        const recordDate = new Date(record.date);
        const day = String(recordDate.getDate()).padStart(2, '0');
        const month = String(recordDate.getMonth() + 1).padStart(2, '0');
        const year = recordDate.getFullYear();

        // Format: DD-MM-YYYY (e.g., 21-01-2026)
        const formattedDate = `${day}-${month}-${year}`;

        const query = searchQuery.toLowerCase();

        // Match against DD-MM-YYYY or just the day (DD) or the raw input
        return formattedDate.includes(query) || record.date.includes(query);
    }) || [];

    // Pagination Logic
    const [currentPage, setCurrentPage] = useState<number>(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalItems = filteredRecords.length;
    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const displayDetails = details ? {
        ...details,
        dailyRecords: paginatedRecords
    } : null;

    const fullDetails = details ? {
        ...details,
        dailyRecords: filteredRecords
    } : null;

    return {
        details: displayDetails,
        fullDetails,
        loading,
        searchQuery,
        pagination: {
            currentPage,
            setCurrentPage,
            totalItems,
            itemsPerPage: ITEMS_PER_PAGE
        },
        actions: {
            setSearchQuery,
            handleBack,
            handleViewTripDetails
        }
    };
};

export default useOdometerDetailsManager;
