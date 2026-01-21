import apiClient from './api';

// --- 1. Backend API Interfaces (DTOs) ---

export interface ApiOdometerRecord {
    _id: string;
    date: string; // ISO Date "YYYY-MM-DD"
    tripNumber: number;
    status: 'in_progress' | 'completed' | 'not_started';

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

export interface ApiEmployee {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string; // Optional if not in backend response yet
}

export interface ApiEmployeeReport {
    employee: ApiEmployee;
    records: ApiOdometerRecord[];
    totalDistance: number;
    tripsCompleted: number;
}

export interface ApiOdometerReportResponse {
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


    status: 'Approved' | 'Pending' | 'Rejected' | 'In Progress' | 'Completed'; // Mapped from backend status

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
    static getRoleDisplay(role: string): string {
        return role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Staff';
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

    static toStats(apiReport: ApiEmployeeReport, dateRange: { start: string, end: string }): OdometerStat {
        return {
            _id: apiReport.employee._id,
            employee: {
                id: apiReport.employee._id,
                name: apiReport.employee.name,
                role: this.getRoleDisplay(apiReport.employee.role),
                avatarUrl: apiReport.employee.avatarUrl
            },
            dateRange,
            totalDistance: apiReport.totalDistance || 0,
            tripCount: apiReport.tripsCompleted || 0
        };
    }

    static toEmployeeDetails(apiReport: ApiEmployeeReport, dateRange: { start: string, end: string }): EmployeeOdometerDetails {
        const dailyMap = new Map<string, DailyOdometerStat>();

        // Group records by date
        apiReport.records.forEach(record => {
            const date = record.date;
            const distance = record.distance || 0;
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
            if (isCompleted) {
                stat.totalKm += distance;
                stat.tripCount += 1;
            }
        });

        const dailyRecords = Array.from(dailyMap.values()).sort((a, b) => b.date.localeCompare(a.date));

        return {
            employee: {
                id: apiReport.employee._id,
                name: apiReport.employee.name,
                role: this.getRoleDisplay(apiReport.employee.role),
                avatarUrl: apiReport.employee.avatarUrl
            },
            summary: {
                dateRange,
                totalDistance: apiReport.totalDistance,
                totalRecords: dailyRecords.length // Days active
            },
            dailyRecords
        };
    }


    static toTripDetails(record: ApiOdometerRecord, employeeName: string, employeeRole: string): TripOdometerDetails {
        // Map backend status to frontend status
        // Backend: 'in_progress' | 'completed' | 'not_started'
        // Frontend: 'Approved' | 'Pending' | 'Rejected' | ...
        // For now, we'll map 'completed' -> 'Approved' (assuming auto-approval) and 'in_progress' -> 'In Progress'
        let status: TripOdometerDetails['status'] = 'Pending';
        if (record.status === 'completed') status = 'Approved';
        if (record.status === 'in_progress') status = 'In Progress';

        return {
            id: record._id,
            tripNumber: record.tripNumber,
            date: record.date,
            employeeName,
            employeeRole,
            status,


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

        try {
            const response = await apiClient.get<ApiOdometerReportResponse>('/odometer/report', {
                params: { month: m, year: y }
            });

            const { report } = response.data.data;

            // Calculate date range for the month
            const startStr = `${y}-${String(m).padStart(2, '0')}-01`;
            const end = new Date(y, m, 0); // last day
            const endStr = end.toISOString().split('T')[0];
            const dateRange = { start: startStr, end: endStr };

            const data = report.map(item => OdometerMapper.toStats(item, dateRange));

            return {
                data,
                total: data.length
            };
        } catch (error) {
            console.error("Failed to fetch odometer stats:", error);
            throw error;
        }
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
            const response = await apiClient.get<ApiOdometerReportResponse>('/odometer/report', {
                params: { month: m, year: y }
            });

            const reportItem = response.data.data.report.find(r => r.employee._id === employeeId);

            if (!reportItem) {
                // Fallback / Empty state
                throw new Error("Employee records not found");
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
            const response = await apiClient.get<ApiOdometerReportResponse>('/odometer/report', {
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
                apiClient.get<{ success: boolean; data: ApiOdometerRecord }>(`/odometer/${summary._id}`)
            );

            const fullTripResponses = await Promise.all(fullTripPromises);

            const fullTrips = fullTripResponses.map(res => res.data.data);

            // Map to TripOdometerDetails
            const role = OdometerMapper.getRoleDisplay(reportItem.employee.role);
            return fullTrips.map(trip => OdometerMapper.toTripDetails(trip, reportItem.employee.name, role));



        } catch (error) {
            return [];
        }
    },
    async deleteTrip(tripId: string): Promise<void> {
        try {
            await apiClient.delete(`/odometer/${tripId}`);
        } catch (error) {
            throw error;
        }
    }
};

// --- 5. Exported Functions (Aliases for backward compatibility) ---

export const fetchOdometerStats = OdometerRepository.getOdometerStats;
export const getEmployeeOdometerDetails = OdometerRepository.getEmployeeOdometerDetails;
export const getTripDetailsByDate = OdometerRepository.getTripDetailsByDate;
export const deleteTrip = OdometerRepository.deleteTrip;
