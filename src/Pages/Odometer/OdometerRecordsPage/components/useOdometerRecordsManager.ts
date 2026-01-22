import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchOdometerStats } from '../../../../api/odometerService';
import { getEmployees } from '../../../../api/employeeService';
import type { Employee } from '../../../../api/employeeService';
import type { OdometerStat } from '../../../../api/odometerService';

const useOdometerRecordsManager = () => {
    const [stats, setStats] = useState<OdometerStat[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [statsResponse, employees] = await Promise.all([
                    fetchOdometerStats(),
                    getEmployees() // Fetch full employee list to get avatars/roles
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
                // setTotalItems(response.total); 
            } catch (error) {
                console.error("Failed to load odometer records:", error);
                // Silently fail or handle error appropriately
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [currentPage, searchQuery]);

    // --- Filtering Logic (Client-Side for Mock) ---
    const filteredStats = stats.filter((item) => {
        // Business Rule: Only show active employees
        if (item.tripCount <= 0) return false;

        // Search
        const term = searchQuery.toLowerCase();
        const matchesSearch = term === "" ||
            item.employee.name.toLowerCase().includes(term) ||
            item.employee.role.toLowerCase().includes(term);

        return matchesSearch;
    });

    const navigate = useNavigate();

    const handleViewDetails = (employeeId: string) => {
        navigate(`/odometer/employee/${employeeId}`);
    };

    const actions = {
        setCurrentPage,
        setSearchQuery,
        onViewDetails: handleViewDetails
    };

    return {
        state: {
            stats: filteredStats,
            loading,
            totalItems: filteredStats.length,
            currentPage,
            searchQuery
        },
        actions
    };
};

export default useOdometerRecordsManager;
