import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeOdometerDetails, type EmployeeOdometerDetails } from '@/api/odometerService';
import toast from 'react-hot-toast';

const useOdometerDetailsManager = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [details, setDetails] = useState<EmployeeOdometerDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);

    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchDetails = async () => {
            if (!employeeId) return;
            setLoading(true);
            setError(null);
            try {
                const data = await getEmployeeOdometerDetails(employeeId);
                setDetails(data);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load employee records";
                setError(message);
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [employeeId]);

    // Reset page on search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Filter Logic
    const filteredRecords = useMemo(() => {
        if (!details?.dailyRecords) return [];

        return details.dailyRecords.filter(record => {
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
        });
    }, [details?.dailyRecords, searchQuery]);

    // Pagination Logic
    const totalItems = filteredRecords.length;
    const paginatedRecords = useMemo(() => {
        return filteredRecords.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [filteredRecords, currentPage]);

    const displayDetails = useMemo(() => {
        return details ? { ...details, dailyRecords: paginatedRecords } : null;
    }, [details, paginatedRecords]);

    const fullDetails = useMemo(() => {
        return details ? { ...details, dailyRecords: filteredRecords } : null;
    }, [details, filteredRecords]);

    const handleBack = useCallback(() => {
        navigate('/odometer');
    }, [navigate]);

    const handleViewTripDetails = useCallback((tripId: string, tripCount: number) => {
        navigate(`/odometer/trip/${tripId}`, { state: { tripCount } });
    }, [navigate]);

    const actions = useMemo(() => ({
        setSearchQuery,
        handleBack,
        handleViewTripDetails
    }), [handleBack, handleViewTripDetails]);

    return {
        details: displayDetails,
        fullDetails,
        loading,
        error,
        searchQuery,
        pagination: {
            currentPage,
            setCurrentPage,
            totalItems,
            itemsPerPage: ITEMS_PER_PAGE
        },
        actions
    };
};

export default useOdometerDetailsManager;
