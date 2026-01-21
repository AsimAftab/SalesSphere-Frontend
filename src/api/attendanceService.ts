import api from './api';

// --- 1. Interfaces ---

export interface SingleUpdatePayload {
  employeeId: string;
  date: string;
  status: string;
  notes?: string;
}

export interface BulkUpdatePayload {
  date: string;
  occasionName: string;
}

export interface CheckInPayload {
  latitude: number;
  longitude: number;
  address: string;
}

export interface CheckOutPayload {
  latitude: number;
  longitude: number;
  address: string;
  isHalfDay?: boolean;
}

export interface Employee {
  id: string;
  name: string;
  attendance: {
    [monthYearKey: string]: string;
  };
}

export interface TransformedReportData {
  employees: Employee[];
  weeklyOffDay: string;
}

export interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  date: string;
  status: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInAddress: string | null;
  checkOutAddress: string | null;
  notes: string | null;
  markedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export interface MyTodayStatusResponse {
  success: boolean;
  data: {
    _id: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    status: string;
    // ...other fields
  } | null;
  organizationTimezone: string;
  organizationCheckInTime: string | null;
  organizationCheckOutTime: string | null;
  organizationHalfDayCheckOutTime: string | null;
  isLate?: boolean;
  message?: string;
}

// Internal Backend Interfaces
interface BackendEmployeeRecord {
  employee: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  records: { [day: number]: string };
  totalWorkingDays: number;
}

interface BackendReportResponse {
  success: boolean;
  data: {
    report: BackendEmployeeRecord[];
    summary: any;
    weeklyOffDay: string;
  };
}

interface BackendSingleRecordResponse {
  success: boolean;
  data: {
    employee: { _id: string; name: string; };
    date: string;
    status: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    checkInAddress: string | null;
    checkOutAddress: string | null;
    notes: string | null;
    markedBy: any | null;
  };
}

/**
 * AttendanceMapper - Transforms attendance data between backend API shape and frontend domain models.
 * Handles complex data transformations including day-by-day attendance records.
 */
class AttendanceMapper {
  /**
   * Transforms backend attendance report to frontend format.
   * Converts day-indexed records object to a formatted attendance string.
   * 
   * @param backendData - Raw attendance report from backend API
   * @param month - Month name (e.g., "January")
   * @param year - Year (e.g., 2024)
   * @returns Transformed report with employees array and weekly off day
   * @example
   * // Backend: { records: { 1: 'P', 2: 'A', 3: '-' } }
   * // Frontend: { attendance: { 'January-2024': 'PA-' } }
   */
  static toFrontendReport(
    backendData: BackendReportResponse,
    month: string,
    year: number
  ): TransformedReportData {
    const monthYearKey = `${month}-${year}`;
    const monthIndex = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ].indexOf(month);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const employees: Employee[] = backendData.data.report.map((record) => {
      const attendanceArray: string[] = [];

      for (let day = 1; day <= daysInMonth; day++) {
        let status = record.records[day];

        if (!status || status === 'N' || status === 'NA' || status === null || status.trim() === '') {
          status = '-';
        }

        attendanceArray.push(status);
      }

      const attendanceString = attendanceArray.join('');

      return {
        id: record.employee._id,
        name: record.employee.name,
        attendance: {
          [monthYearKey]: attendanceString,
        },
      };
    });

    return {
      employees,
      weeklyOffDay: backendData.data.weeklyOffDay || 'Saturday',
    };
  }

  /**
   * Transforms a single employee attendance record from backend to frontend format.
   * Handles populated markedBy field.
   * 
   * @param backendData - Raw single record data from backend
   * @returns Normalized AttendanceRecord for frontend use
   */
  static toFrontendRecord(backendData: BackendSingleRecordResponse['data']): AttendanceRecord {
    return {
      employeeId: backendData.employee._id,
      employeeName: backendData.employee.name,
      date: backendData.date,
      status: backendData.status,
      checkInTime: backendData.checkInTime,
      checkOutTime: backendData.checkOutTime,
      checkInAddress: backendData.checkInAddress,
      checkOutAddress: backendData.checkOutAddress,
      notes: backendData.notes,
      markedBy: backendData.markedBy ? {
        id: backendData.markedBy._id,
        name: backendData.markedBy.name,
        role: backendData.markedBy.role
      } : null
    };
  }
}

// --- 3. Centralized Endpoints ---
const ENDPOINTS = {
  REPORT: '/attendance/report',
  ADMIN_MARK: '/attendance/admin/mark',
  ADMIN_MARK_HOLIDAY: '/attendance/admin/mark-holiday',
  EMPLOYEE_RECORD: (id: string, date: string) => `/attendance/employee/${id}/date/${date}`,
  CHECK_IN: '/attendance/check-in',
  CHECK_OUT: '/attendance/check-out',
  STATUS_TODAY: '/attendance/status/today',
};

// --- 4. Repository Pattern ---
export const AttendanceRepository = {
  /**
   * Fetches attendance data for a given month and year.
   */
  async fetchAttendanceData(month: string, year: number): Promise<TransformedReportData> {


    const monthIndex = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ].indexOf(month);

    const monthNumber = monthIndex + 1;

    try {
      const { data } = await api.get<BackendReportResponse>(ENDPOINTS.REPORT, {
        params: {
          month: monthNumber,
          year: year,
        },
      });

      if (data.success) {
        return AttendanceMapper.toFrontendReport(data, month, year);
      } else {
        throw new Error('Failed to fetch attendance data');
      }
    } catch (error) {
      throw error;
    }
  },

  async updateSingleAttendance(payload: SingleUpdatePayload): Promise<any> {
    try {
      const { data } = await api.put(ENDPOINTS.ADMIN_MARK, payload);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateBulkAttendance(payload: BulkUpdatePayload): Promise<any> {
    try {
      const { data } = await api.post(ENDPOINTS.ADMIN_MARK_HOLIDAY, payload);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async fetchEmployeeRecordByDate(
    employeeId: string,
    date: string // Expects "YYYY-MM-DD"
  ): Promise<AttendanceRecord> {
    try {
      const { data } = await api.get<BackendSingleRecordResponse>(ENDPOINTS.EMPLOYEE_RECORD(employeeId, date));
      if (data.success && data.data) {
        return AttendanceMapper.toFrontendRecord(data.data);
      }
      throw new Error('Failed to fetch record');
    } catch (error) {
      throw error;
    }
  },

  /* =========================================================================
     Web Check-In / Check-Out Methods
     ========================================================================= */

  async checkInEmployee(payload: CheckInPayload): Promise<any> {
    try {
      const { data } = await api.post(ENDPOINTS.CHECK_IN, payload);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async checkOutEmployee(payload: CheckOutPayload): Promise<any> {
    try {
      const { data } = await api.put(ENDPOINTS.CHECK_OUT, payload);
      return data;
    } catch (error) {
      throw error;
    }
  },

  async fetchMyStatusToday(): Promise<MyTodayStatusResponse> {
    try {
      const { data } = await api.get(ENDPOINTS.STATUS_TODAY);
      return data;
    } catch (error) {
      throw error;
    }
  }
};

// --- 5. Clean Named Exports ---
export const {
  fetchAttendanceData,
  updateSingleAttendance,
  updateBulkAttendance,
  fetchEmployeeRecordByDate,
  checkInEmployee,
  checkOutEmployee,
  fetchMyStatusToday
} = AttendanceRepository;