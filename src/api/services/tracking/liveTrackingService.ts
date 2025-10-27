import api from '../../config/api';

// 1. Define the data types for each component/view

/**
 * For the top statistic cards in EmployeesView.
 */
export interface EmployeeStats {
  totalEmployees: number;
  activeNow: number;
  idle: number;
  inactive: number;
}

/**
 * For the list of employees in EmployeesView.
 * This is a summary view.
 */
export interface Employee {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Idle' | 'Inactive';
  checkIn: string;
  lastLocation: string;
  distance: number;
  avatar: string;
  avatarColor: string;
  idleTime?: string;
}

/**
 * For the location pins in TerritoryView.
 */
export interface TerritoryLocation {
  id: string;
  type: 'Prospect' | 'Party' | 'Site';
  name: string;
  address: string;
  status: 'Hot Lead' | 'Cold' | 'Warm';
  coords: { top: string; left: string };
}

/**
 * For the detailed view of a single employee.
 * This is different from the summary 'Employee' type.
 */
export interface EmployeeDetails {
  id: string;
  name: string;
  role: string;
  avatar: string;
  avatarColor: string;
  status: 'Active' | 'Idle' | 'Inactive';
  checkIn: string;
  distance: number;
  locationsVisited: number;
}

/**
 * For the route history timeline on the details page.
 */
export interface RouteHistoryItem {
  time: string;
  title: string;
  isCurrent?: boolean;
}


// 2. Create individual functions to fetch data from each endpoint

const fetchEmployeeStats = () => api.get<{ data: EmployeeStats }>('/tracking/stats');
const fetchEmployeesList = () => api.get<{ data: Employee[] }>('/tracking/employees');
const fetchTerritoryLocations = () => api.get<{ data: TerritoryLocation[] }>('/tracking/territory-locations');

// These functions require an ID to fetch data for a specific employee
const fetchEmployeeDetails = (employeeId: string) => api.get<{ data: EmployeeDetails }>(`/tracking/employees/${employeeId}/details`);
const fetchEmployeeRouteHistory = (employeeId: string) => api.get<{ data: RouteHistoryItem[] }>(`/tracking/employees/${employeeId}/route-history`);


// 3. Create main functions to fetch data for each page/view concurrently

/**
 * Fetches all data needed for the main LiveTrackingPage
 * (both Employees and Territory tabs).
 */
export const getLiveTrackingData = async () => {
  try {
    const [
      statsResponse,
      employeesResponse,
      locationsResponse
    ] = await Promise.all([
      fetchEmployeeStats(),
      fetchEmployeesList(),
      fetchTerritoryLocations()
    ]);

    return {
      stats: statsResponse.data.data,
      employees: employeesResponse.data.data,
      locations: locationsResponse.data.data,
    };
  } catch (error) {
    console.error("Failed to fetch live tracking data:", error);
    throw error;
  }
};

/**
 * Fetches all data needed for the EmployeeTrackingDetailsPage.
 * @param employeeId The ID of the employee to fetch details for.
 */
export const getEmployeeDetailsData = async (employeeId: string) => {
    // Basic validation
    if (!employeeId) {
        throw new Error("Employee ID is required.");
    }

    try {
        const [
            detailsResponse,
            routeHistoryResponse
        ] = await Promise.all([
            fetchEmployeeDetails(employeeId),
            fetchEmployeeRouteHistory(employeeId)
        ]);

        return {
            details: detailsResponse.data.data,
            routeHistory: routeHistoryResponse.data.data
        };
    } catch (error) {
        console.error(`Failed to fetch details for employee ${employeeId}:`, error);
        throw error;
    }
}
