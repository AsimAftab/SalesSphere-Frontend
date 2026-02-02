import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOdometerStats } from '@/api/odometerService';
import { getEmployees } from '@/api/employeeService';
import type { Employee } from '@/api/employeeService';
import type { OdometerStat } from '@/api/odometerService';

const useOdometerRecordsManager = () => {
    const [stats, setStats] = useState<OdometerStat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [statsResponse, employees] = await Promise.all([
                    fetchOdometerStats(),
                    getEmployees()
                ]);

                // Create a map for O(1) lookup
                const employeeMap = new Map(employees.map((e: Employee) => [e._id, e]));

                // Enrich stats with current employee details
                const enrichedStats = statsResponse.data.map((stat: OdometerStat) => {
                    const empDetails = employeeMap.get(stat.employee.id);
                    if (empDetails) {
                        return {
                            ...stat,
                            employee: {
                                ...stat.employee,
                                avatarUrl: empDetails.avatarUrl,
                                role: (empDetails.customRoleId && typeof empDetails.customRoleId === 'object' && 'name' in empDetails.customRoleId)
                                    ? empDetails.customRoleId.name
                                    : (empDetails.role ? (empDetails.role.charAt(0).toUpperCase() + empDetails.role.slice(1)) : 'Staff')
                            }
                        };
                    }
                    return stat;
                });

                setStats(enrichedStats);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Failed to load odometer records";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage, searchQuery]);

    // --- Filtering Logic (Client-Side) ---
    const filteredStats = useMemo(() => {
        return stats.filter((item) => {
            // Business Rule: Only show active employees
            if (item.tripCount <= 0) return false;

            // Search
            const term = searchQuery.toLowerCase();
            const matchesSearch = term === "" ||
                item.employee.name.toLowerCase().includes(term) ||
                item.employee.role.toLowerCase().includes(term);

            return matchesSearch;
        });
    }, [stats, searchQuery]);

    const handleViewDetails = useCallback((employeeId: string) => {
        navigate(`/odometer/employee/${employeeId}`);
    }, [navigate]);

    const actions = useMemo(() => ({
        setCurrentPage,
        setSearchQuery,
        onViewDetails: handleViewDetails
    }), [handleViewDetails]);

    return {
        state: {
            stats: filteredStats,
            loading,
            error,
            totalItems: filteredStats.length,
            currentPage,
            searchQuery
        },
        actions
    };
};

export default useOdometerRecordsManager;
