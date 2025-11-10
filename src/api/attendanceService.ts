import api from './api';

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


const transformData = (
  backendData: BackendReportResponse,
  month: string,
  year: number
): TransformedReportData => {
  const monthYearKey = `${month}-${year}`;

  const employees: Employee[] = backendData.data.report.map((record) => {
   
    const dayKeys = Object.keys(record.records).map(Number).sort((a, b) => a - b);
    const attendanceString = dayKeys.map(day => record.records[day]).join('');

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
};

/**
 * Fetches attendance data for a given month and year.
 * @param month - The full name of the month (e.g., "October")
 * @param year - The four-digit year (e.g., 2025)
 * @returns A promise that resolves to the transformed data.
 */
export const fetchAttendanceData = async (
  month: string,
  year: number
): Promise<TransformedReportData> => {
  console.log(`Fetching data for ${month} ${year}...`);

  
  const monthIndex = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ].indexOf(month);

  const monthNumber = monthIndex + 1;

  try {
    const { data } = await api.get<BackendReportResponse>('/attendance/report', {
      params: {
        month: monthNumber,
        year: year,
      },
    });

    if (data.success) {
      return transformData(data, month, year);
    } else {
      throw new Error('Failed to fetch attendance data');
    }
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    throw error;
  }
};


export const updateSingleAttendance = async (
  payload: SingleUpdatePayload
): Promise<any> => {
  try {
    const { data } = await api.put('/attendance/admin/mark', payload);
    return data;
  } catch (error) {
    console.error('Error updating single attendance:', error);
    throw error;
  }
};


export const updateBulkAttendance = async (
  payload: BulkUpdatePayload
): Promise<any> => {
  try {
    const { data } = await api.post('/attendance/admin/mark-holiday', payload);
    return data;
  } catch (error) {
    console.error('Error in bulk attendance update:', error);
    throw error;
  }
};

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


export const fetchEmployeeRecordByDate = async (
  employeeId: string,
  date: string // Expects "YYYY-MM-DD"
): Promise<BackendSingleRecordResponse> => {
  try {
    const { data } = await api.get(
      `/attendance/employee/${employeeId}/date/${date}`
    );
    return data;
  } catch (error) {
    console.error('Error fetching single employee record:', error);
    throw error;
  }
};