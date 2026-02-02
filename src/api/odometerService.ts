import apiClient from './api';
import { API_ENDPOINTS } from './endpoints';

// --- 1. Backend API Interfaces (DTOs) — Internal, not for consumer use ---

interface ApiOdometerRecord {
    _id: string;
    date: string; // ISO Date "YYYY-MM-DD"
    tripNumber: number;
    status: 'in_progress' | 'completed';

    // Start Data
    startReading?: number;
    startUnit?: string;
    startImage?: string;
    startDescription?: string;
    startLocation?: { address: string; latitude: number; longitude: number };
    startTime?: string;

    // Stop Data
    stopReading?: number;
    stopUnit?: string;
    stopImage?: string;
    stopDescription?: string;
    stopLocation?: { address: string; latitude: number; longitude: number };
    stopTime?: string;

    // Calculated
    distance?: number;
}

interface ApiEmployee {
    _id: string;
    name: string;
    email: string;
    role: string;
    customRoleId?: string | { name: string };
    avatarUrl?: string;
}

interface ApiEmployeeReport {
    employee: ApiEmployee;
    records: ApiOdometerRecord[];
    totalDistance: number;
    tripsCompleted: number;
}

interface ApiOdometerReportResponse {
    success: boolean;
    data: {
        month: number;
        year: number;
        report: ApiEmployeeReport[];
    };
    organizationTimezone: string;
}

// --- 2. Frontend Domain Interfaces ---

export interface OdometerStat {
    _id: string; // Employee ID
    employee: {
        id: string;
        name: string;
        role: string;
        avatarUrl?: string;
    };
    dateRange: {
        start: string;
        end: string;
    };
    totalDistance: number; // in KM
    tripCount: number;
}

export interface DailyOdometerStat {
    id: string; // Composite: "empId|date"
    date: string;
    totalKm: number;
    tripCount: number;
}

export interface EmployeeOdometerDetails {
    employee: {
        id: string;
        name: string;
        role: string;
        avatarUrl?: string;
    };
    summary: {
        dateRange: { start: string; end: string };
        totalDistance: number;
        totalRecords: number;
    };
    dailyRecords: DailyOdometerStat[];
}

export interface TripOdometerDetails {
    id: string;
    tripNumber: number;
    date: string;
    employeeName: string;
    employeeRole: string;


    status: 'In Progress' | 'Completed'; // Mapped from backend status
    distanceUnit: 'km' | 'miles';

    // Timeline
    startTime: string;
    endTime: string;

    // Readings
    startReading: number;
    endReading: number;
    totalDistance: number;

    // Locations
    startLocation: {
        address: string;
        coordinates: string;
    };
    endLocation: {
        address: string;
        coordinates: string;
    };

    // Descriptions
    startDescription: string;
    endDescription: string;

    // Images
    startImage: string;
    endImage: string;
}

// --- 3. Mapper Class ---

export class OdometerMapper {
    /**
     * Derives the actual active date range from records, falling back to a default.
     */
    private static deriveDateRange(
        records: ApiOdometerRecord[] | undefined,
        fallback: { start: string; end: string }
    ): { start: string; end: string } {
        if (!records || records.length === 0) return fallback;

        const sorted = [...records].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        return { start: sorted[0].date, end: sorted[sorted.length - 1].date };
    }

    static getRoleDisplay(role: string, customRoleId?: string | { name: string }): string {
        // 1. Priority: Custom Role Name (e.g. "Sales Manager")
        if (customRoleId && typeof customRoleId === 'object' && 'name' in customRoleId) {
            return customRoleId.name;
        }

        // 2. Fallback: System Role (e.g. "admin", "user") - Capitalized
        if (role) return role.charAt(0).toUpperCase() + role.slice(1);

        return 'Staff';
    }

    // Helper to convert distance to KM
    private static convertToKm(distance: number, unit?: string): number {
        if (unit === 'miles') {
            return distance * 1.60934;
        }
        return distance;
    }

    // Default formatting for missing location/description
    private static formatLocation(loc?: { address: string; latitude: number; longitude: number }) {
        if (!loc) return { address: 'Location not captured', coordinates: '' };
        const coords = (loc.latitude && loc.longitude)
            ? `${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`
            : '';
        return {
            address: loc.address || 'Address not available',
            coordinates: coords
        };
    }

    static toStats(apiReport: ApiEmployeeReport, defaultDateRange: { start: string, end: string }): OdometerStat {
        const dynamicDateRange = this.deriveDateRange(apiReport.records, defaultDateRange);

        return {
            _id: apiReport.employee._id,
            employee: {
                id: apiReport.employee._id,
                name: apiReport.employee.name,
                role: this.getRoleDisplay(apiReport.employee.role, apiReport.employee.customRoleId),
                avatarUrl: apiReport.employee.avatarUrl
            },
            dateRange: dynamicDateRange,
            totalDistance: apiReport.totalDistance || 0,
            tripCount: apiReport.tripsCompleted || 0
        };
    }

    static toEmployeeDetails(apiReport: ApiEmployeeReport, dateRange: { start: string, end: string }): EmployeeOdometerDetails {
        const dailyMap = new Map<string, DailyOdometerStat>();

        // Group records by date
        apiReport.records.forEach(record => {
            const date = record.date;
            // Normalize distance to KM for aggregation
            const rawDistance = record.distance || 0;
            const unit = record.stopUnit || record.startUnit || 'km'; // Default to km if missing
            const distanceInKm = OdometerMapper.convertToKm(rawDistance, unit);
            const isCompleted = record.status === 'completed';

            if (!dailyMap.has(date)) {
                dailyMap.set(date, {
                    id: `${apiReport.employee._id}|${date}`, // Composite ID
                    date,
                    totalKm: 0,
                    tripCount: 0
                });
            }

            const stat = dailyMap.get(date)!;

            // Increment trip count for ANY record (completed or in_progress)
            stat.tripCount += 1;

            if (isCompleted) {
                stat.totalKm += distanceInKm;
            }
        });

        const dailyRecords = Array.from(dailyMap.values())
            .map(record => ({
                ...record,
                totalKm: Number(record.totalKm.toFixed(3))
            }))
            .sort((a, b) => b.date.localeCompare(a.date));

        const dynamicDateRange = this.deriveDateRange(apiReport.records, dateRange);

        return {
            employee: {
                id: apiReport.employee._id,
                name: apiReport.employee.name,
                role: this.getRoleDisplay(apiReport.employee.role, apiReport.employee.customRoleId),
                avatarUrl: apiReport.employee.avatarUrl
            },
            summary: {
                dateRange: dynamicDateRange,
                totalDistance: Number((apiReport.totalDistance || 0).toFixed(3)),
                totalRecords: dailyRecords.length // Days active
            },
            dailyRecords
        };
    }


    static toTripDetails(record: ApiOdometerRecord, employeeName: string, employeeRole: string): TripOdometerDetails {
        // Map backend status to frontend status
        // Backend: 'in_progress' | 'completed'
        // Frontend: 'In Progress' | 'Completed'
        let status: TripOdometerDetails['status'] = 'In Progress';
        if (record.status === 'completed') status = 'Completed';

        // Determine unit (prefer stopUnit, fallback to startUnit, default 'km')
        const distanceUnit = (record.stopUnit || record.startUnit || 'km') as 'km' | 'miles';

        return {
            id: record._id,
            tripNumber: record.tripNumber,
            date: record.date,
            employeeName,
            employeeRole,
            status,
            distanceUnit,


            startTime: record.startTime || '',
            endTime: record.stopTime || '',

            startReading: record.startReading || 0,
            endReading: record.stopReading || 0,
            totalDistance: record.distance || 0,

            startLocation: this.formatLocation(record.startLocation),
            endLocation: this.formatLocation(record.stopLocation),

            startDescription: record.startDescription || '',
            endDescription: record.stopDescription || '',

            startImage: record.startImage || '',
            endImage: record.stopImage || ''
        };
    }
}

// --- 4. Service / Repository ---

export const OdometerRepository = {

    /**
     * Fetches the main list of employees and their stats for a given month.
     */
    async getOdometerStats(month?: number, year?: number): Promise<{ data: OdometerStat[]; total: number }> {
        const now = new Date();
        const m = month || now.getMonth() + 1;
        const y = year || now.getFullYear();

        const response = await apiClient.get<ApiOdometerReportResponse>(API_ENDPOINTS.odometer.REPORT, {
            params: { month: m, year: y }
        });

        const { report } = response.data.data;

        const startStr = `${y}-${String(m).padStart(2, '0')}-01`;
        const end = new Date(y, m, 0);
        const endStr = end.toISOString().split('T')[0];
        const dateRange = { start: startStr, end: endStr };

        const data = report.map(item => OdometerMapper.toStats(item, dateRange));

        return { data, total: data.length };
    },

    /**
     * Fetches detailed daily summaries for a specific employee.
     * Note: Re-fetches the report filter by implicit user access, then finds the specific employee client-side.
     * Optimization: Backend should ideally support /odometer/report/:employeeId or similar.
     */
    async getEmployeeOdometerDetails(employeeId: string, month?: number, year?: number): Promise<EmployeeOdometerDetails> {
        const now = new Date();
        const m = month || now.getMonth() + 1;
        const y = year || now.getFullYear();

        try {
            const response = await apiClient.get<ApiOdometerReportResponse>(API_ENDPOINTS.odometer.REPORT, {
                params: { month: m, year: y }
            });

            const reportItem = response.data.data.report.find(r => r.employee._id === employeeId);

            if (!reportItem) {
                // Fallback / Empty state
                throw new Error("Employee records not found");
            }

            // Enterprise Pattern: Data Enrichment (Fetch full employee profile for role/avatar)
            try {
                // We need to fetch the user details to get the correct Custom Role / Avatar that might be missing in the report
                const userResponse = await apiClient.get<{ success: boolean, data: ApiEmployee }>(API_ENDPOINTS.users.DETAIL(employeeId));
                const fullEmployee = userResponse.data.data;

                // Merge populated data into the report item's employee object
                reportItem.employee = {
                    ...reportItem.employee,
                    ...fullEmployee, // Overwrite with full details (customRoleId, avatarUrl, etc.)
                    // Ensure role logic from full profile takes precedence
                    role: fullEmployee.role || reportItem.employee.role,
                    customRoleId: fullEmployee.customRoleId
                };
            } catch (err) {
                console.warn("Could not fetch full employee details, using report data only", err);
            }

            const startStr = `${y}-${String(m).padStart(2, '0')}-01`;
            const end = new Date(y, m, 0);
            const endStr = end.toISOString().split('T')[0];

            return OdometerMapper.toEmployeeDetails(reportItem, { start: startStr, end: endStr });

        } catch (error) {
            console.error("Failed to fetch employee odometer details:", error);
            throw error;
        }
    },

    /**
     * Fetches individual trips for a specific day.
     * @param dailyRecordId Composite ID "employeeId|date" e.g. "emp123|2026-01-16"
     */
    async getTripDetailsByDate(dailyRecordId: string): Promise<TripOdometerDetails[]> {
        // Parse the composite ID
        const [employeeId, dateStr] = dailyRecordId.split('|');
        if (!employeeId || !dateStr) {
            throw new Error("Invalid record ID format");
        }

        const dateObj = new Date(dateStr);
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();

        try {
            // 1. Get the list of trip IDs for this date from the report
            const response = await apiClient.get<ApiOdometerReportResponse>(API_ENDPOINTS.odometer.REPORT, {
                params: { month, year }
            });

            const reportItem = response.data.data.report.find(r => r.employee._id === employeeId);

            if (!reportItem || !reportItem.records) {
                return [];
            }

            // Filter records by date to get the IDs
            const daysTripSummaries = reportItem.records.filter(r => r.date === dateStr);

            if (daysTripSummaries.length === 0) return [];

            // 2. Fetch FULL details for each trip
            // The report summary is missing locations/images, so we must fetch individually.
            const fullTripPromises = daysTripSummaries.map(summary =>
                apiClient.get<{ success: boolean; data: ApiOdometerRecord }>(API_ENDPOINTS.odometer.DETAIL(summary._id))
            );

            const fullTripResponses = await Promise.all(fullTripPromises);

            const fullTrips = fullTripResponses.map(res => res.data.data);

            // Enterprise Fix: Fetch full employee details to ensure Custom Role is present
            // (The report API summary often lacks this, so we must enrich it like in getEmployeeOdometerDetails)
            try {
                const userResponse = await apiClient.get<{ success: boolean, data: ApiEmployee }>(API_ENDPOINTS.users.DETAIL(employeeId));
                if (userResponse.data.success) {
                    const fullUser = userResponse.data.data;
                    // Update the report item with the full details
                    reportItem.employee.customRoleId = fullUser.customRoleId;
                    reportItem.employee.role = fullUser.role || reportItem.employee.role;
                }
            } catch {
                // Non-critical: trip details render fine with report-level employee data
            }

            // Map to TripOdometerDetails
            const role = OdometerMapper.getRoleDisplay(reportItem.employee.role, reportItem.employee.customRoleId);
            return fullTrips.map(trip => OdometerMapper.toTripDetails(trip, reportItem.employee.name, role));



        } catch {
            return [];
        }
    },
    async deleteTrip(tripId: string): Promise<void> {
        await apiClient.delete(API_ENDPOINTS.odometer.DETAIL(tripId));
    }
};

// --- 5. Exported Functions (Aliases for backward compatibility) ---

export const fetchOdometerStats = OdometerRepository.getOdometerStats;
export const getEmployeeOdometerDetails = OdometerRepository.getEmployeeOdometerDetails;
export const getTripDetailsByDate = OdometerRepository.getTripDetailsByDate;
export const deleteTrip = OdometerRepository.deleteTrip;
