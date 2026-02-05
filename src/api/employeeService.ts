import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { handleApiError } from './errors';

// --- TYPE DEFINITION ---
export interface Employee {
  _id: string;
  name: string;
  email: string;
  role: string;                // Base role ('user' for org employees)
  customRoleId?: string | {    // Dynamic role reference
    _id: string;
    name: string;
    description?: string;
  };
  organizationId?: string;
  isActive?: boolean;
  avatarUrl?: string;
  phone?: string;
  address?: string;
  gender?: string;
  // FIX: Re-added 'age' as it's a virtual property sent by the backend.
  age?: number;
  dateOfBirth?: string; // Correct property for the date field
  panNumber?: string;
  citizenshipNumber?: string;
  dateJoined?: string;
  documents?: {
    _id?: string;
    fileName: string;
    fileUrl: string;
    uploadedAt?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;

  avatar?: string;     // For frontend compatibility (from avatarUrl)
  position?: string;
  reportsTo?: {
    _id: string;
    name: string;
    role: string | { name: string };
  }[];
}

export type UpdateEmployeeData = {
  phone?: string;
  address?: string;
  role?: string;
  name?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string; // Use dateOfBirth for updating
  panNumber?: string;
  citizenshipNumber?: string;
  dateJoined?: string;
  reportsTo?: string[];
};

// --- RESPONSE TYPE INTERFACES (from backend) ---
interface GetEmployeesResponse {
  success: boolean;
  data: Employee[];
}

interface EmployeeResponse {
  success: boolean;
  data: Employee;
}

interface DeleteResponse {
  success: boolean;
  message: string;
}

interface DocumentUploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    fileUrl: string;
  }[];
}

export interface AttendanceStats {
  present: number;
  absent: number;
  leave: number;
  halfDay: number;
  weeklyOff: number;
  workingDays: number;
  totalDays: number;
  attendancePercentage: number;
}

export interface AttendanceSummaryEmployee {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AttendanceSummaryData {
  month: number;
  year: number;
  weeklyOffDay: string;
  employee: AttendanceSummaryEmployee;
  attendance: AttendanceStats;
  attendancePercentage: string;
}


// Error handling now uses centralized handleApiError from @/api/errors

// --- API FUNCTIONS ---

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await api.get<GetEmployeesResponse>(API_ENDPOINTS.users.BASE);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch employees.");
  }
};

export const getEmployeeById = async (userId: string): Promise<Employee> => {
  try {
    const response = await api.get<EmployeeResponse>(API_ENDPOINTS.users.DETAIL(userId));
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch employee details.");
  }
};

export const addEmployee = async (formData: FormData): Promise<Employee> => {
  try {
    const response = await api.post<EmployeeResponse>(
      API_ENDPOINTS.users.BASE,
      formData,
      {
        timeout: 0, // ⏱ disable timeout for this request
        headers: {
          'Content-Type': 'multipart/form-data', // ✅ required for file uploads
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to create employee.");
  }
};


export const uploadEmployeeDocuments = async (userId: string, documents: File[]): Promise<DocumentUploadResponse> => {
  try {
    const formData = new FormData();
    documents.forEach((file) => {
      formData.append('documents', file); // ✅ field name matches backend
    });

    const response = await api.post<DocumentUploadResponse>(
      API_ENDPOINTS.users.DOCUMENTS(userId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data', // ✅ important
        },
      }
    );

    return response.data;
  } catch (error) {
    throw handleApiError(error, "Failed to upload documents.");
  }
};

// Add this function to your existing employeeService.ts file

export const deleteEmployeeDocument = async (userId: string, documentId: string): Promise<{ success: boolean }> => {
  try {
    // Based on your backend controller: DELETE /users/:id/documents/:documentId
    const response = await api.delete<DeleteResponse>(API_ENDPOINTS.users.DOCUMENT_DETAIL(userId, documentId));
    return { success: response.data.success };
  } catch (error) {
    throw handleApiError(error, "Failed to delete document.");
  }
};

// FIX: Update function signature to accept FormData or UpdateEmployeeData
export const updateEmployee = async (userId: string, updateData: UpdateEmployeeData | FormData): Promise<Employee> => {
  try {
    const response = await api.put<EmployeeResponse>(API_ENDPOINTS.users.DETAIL(userId), updateData);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to update employee details.");
  }
};

export const deleteEmployee = async (userId: string): Promise<{ success: boolean }> => {
  try {
    const response = await api.delete<DeleteResponse>(API_ENDPOINTS.users.DETAIL(userId));
    return { success: response.data.success };
  } catch (error) {
    throw handleApiError(error, "Failed to delete employee.");
  }
};

// --- Supervisor Hierarchy Management ---
export const setUserSupervisors = async (userId: string, supervisorIds: string[]): Promise<Employee> => {
  const response = await api.put<EmployeeResponse>(API_ENDPOINTS.users.SUPERVISORS(userId), {
    reportsTo: supervisorIds
  });
  return response.data.data;
};

export const fetchAttendanceSummary = async (
  employeeId: string,
  month: number,
  year: number
): Promise<AttendanceSummaryData> => {
  try {
    const response = await api.get<{ month: number; year: number; weeklyOffDay: string; data: { employee: AttendanceSummaryEmployee; attendance: AttendanceStats; attendancePercentage: string } }>(
      API_ENDPOINTS.users.ATTENDANCE_SUMMARY(employeeId),
      {
        params: { month, year }
      }
    );

    // FIX: Reconstruct the final object needed by the component by combining top-level and nested data
    return {
      month: response.data.month,
      year: response.data.year,
      weeklyOffDay: response.data.weeklyOffDay,
      employee: response.data.data.employee,
      attendance: response.data.data.attendance,
      attendancePercentage: response.data.data.attendancePercentage,
    } as AttendanceSummaryData; // Cast to your defined structure
  } catch (error) {
    throw handleApiError(error, "Failed to fetch attendance summary.");
  }
};

// --- Organization Hierarchy Types ---
export interface OrgHierarchyNode {
  _id: string;
  name: string;
  email: string;
  role: string;
  customRole: string | null;
  avatarUrl: string | null;
  subordinates: OrgHierarchyNode[];
}

export interface OrgHierarchyResponse {
  organization: string;
  totalEmployees: number;
  hierarchy: OrgHierarchyNode[];
  employees: {
    _id: string;
    name: string;
    email: string;
    role: string;
    supervisors: {
      _id: string;
      name: string;
      role: string;
    }[];
  }[];
}

// --- Organization Hierarchy API ---
export const getOrgHierarchy = async (): Promise<OrgHierarchyResponse> => {
  try {
    const response = await api.get<{ success: boolean; data: OrgHierarchyResponse }>(API_ENDPOINTS.users.ORG_HIERARCHY);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error, "Failed to fetch organization hierarchy.");
  }
};