/**
 * Employee Service
 * Handles API interactions for Employee management.
 * Uses BaseRepository pattern for standardized CRUD operations.
 */
import api from './api';
import { API_ENDPOINTS } from './endpoints';
import { BaseRepository } from './base';
import type { EndpointConfig } from './base';
import { handleApiError } from './errors';

// =============================================================================
// 1. Type Definitions
// =============================================================================

/**
 * Employee (Frontend Model)
 */
export interface Employee {
  id: string;
  _id?: string; // Backward compatibility
  name: string;
  email: string;
  role: string;
  customRoleId?: string | {
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
  age?: number;
  dateOfBirth?: string;
  panNumber?: string;
  citizenshipNumber?: string;
  dateJoined?: string;
  documents?: EmployeeDocument[];
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  position?: string;
  reportsTo?: {
    _id: string;
    name: string;
    role: string | { name: string };
  }[];
}

export interface EmployeeDocument {
  _id?: string;
  fileName: string;
  fileUrl: string;
  uploadedAt?: string;
}

export type CreateEmployeeData = FormData;

export type UpdateEmployeeData = {
  phone?: string;
  address?: string;
  role?: string;
  name?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  panNumber?: string;
  citizenshipNumber?: string;
  dateJoined?: string;
  reportsTo?: string[];
} | FormData;

// =============================================================================
// 2. Backend API Interfaces (Raw Shape)
// =============================================================================

interface ApiEmployee {
  _id: string;
  name: string;
  email: string;
  role: string;
  customRoleId?: string | {
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
  age?: number;
  dateOfBirth?: string;
  panNumber?: string;
  citizenshipNumber?: string;
  dateJoined?: string;
  documents?: EmployeeDocument[];
  createdAt?: string;
  updatedAt?: string;
  reportsTo?: {
    _id: string;
    name: string;
    role: string | { name: string };
  }[];
}

interface EmployeeResponse {
  success: boolean;
  data: ApiEmployee;
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

// =============================================================================
// 3. Additional Types (Attendance, Hierarchy)
// =============================================================================

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

// =============================================================================
// 4. Mapper Logic
// =============================================================================

export class EmployeeMapper {
  static toFrontend(apiEmployee: ApiEmployee): Employee {
    return {
      id: apiEmployee._id,
      _id: apiEmployee._id, // Backward compatibility
      name: apiEmployee.name,
      email: apiEmployee.email,
      role: apiEmployee.role,
      customRoleId: apiEmployee.customRoleId,
      organizationId: apiEmployee.organizationId,
      isActive: apiEmployee.isActive,
      avatarUrl: apiEmployee.avatarUrl,
      avatar: apiEmployee.avatarUrl, // Alias for frontend compatibility
      phone: apiEmployee.phone,
      address: apiEmployee.address,
      gender: apiEmployee.gender,
      age: apiEmployee.age,
      dateOfBirth: apiEmployee.dateOfBirth,
      panNumber: apiEmployee.panNumber,
      citizenshipNumber: apiEmployee.citizenshipNumber,
      dateJoined: apiEmployee.dateJoined,
      documents: apiEmployee.documents,
      createdAt: apiEmployee.createdAt,
      updatedAt: apiEmployee.updatedAt,
      position: apiEmployee.role, // Alias
      reportsTo: apiEmployee.reportsTo,
    };
  }

  static toPayload(data: CreateEmployeeData | UpdateEmployeeData): FormData | Record<string, unknown> {
    // If it's already FormData, return as-is
    if (data instanceof FormData) {
      return data;
    }
    // Otherwise return the object
    return data as Record<string, unknown>;
  }
}

// =============================================================================
// 5. Endpoint Configuration
// =============================================================================

const EMPLOYEE_ENDPOINTS: EndpointConfig = {
  BASE: API_ENDPOINTS.users.BASE,
  DETAIL: API_ENDPOINTS.users.DETAIL,
};

// =============================================================================
// 6. EmployeeRepositoryClass - Extends BaseRepository
// =============================================================================

class EmployeeRepositoryClass extends BaseRepository<
  Employee,
  ApiEmployee,
  CreateEmployeeData,
  UpdateEmployeeData
> {
  protected readonly endpoints = EMPLOYEE_ENDPOINTS;

  protected mapToFrontend(apiData: ApiEmployee): Employee {
    return EmployeeMapper.toFrontend(apiData);
  }

  protected mapToPayload(data: CreateEmployeeData | UpdateEmployeeData): FormData | Record<string, unknown> {
    return EmployeeMapper.toPayload(data);
  }

  // Override getAll to add error handling
  async getAll(): Promise<Employee[]> {
    try {
      return await super.getAll();
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch employees.');
    }
  }

  // Override getById to add error handling
  async getById(id: string): Promise<Employee> {
    try {
      return await super.getById(id);
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch employee details.');
    }
  }

  // Override create with multipart/form-data support
  async create(data: CreateEmployeeData): Promise<Employee> {
    try {
      const response = await api.post<EmployeeResponse>(
        this.endpoints.BASE,
        data,
        {
          timeout: 0, // Disable timeout for file uploads
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return this.mapToFrontend(response.data.data);
    } catch (error) {
      throw handleApiError(error, 'Failed to create employee.');
    }
  }

  // Override update to handle both FormData and plain objects
  async update(id: string, data: UpdateEmployeeData): Promise<Employee> {
    try {
      const response = await api.put<EmployeeResponse>(
        this.endpoints.DETAIL(id),
        data
      );
      return this.mapToFrontend(response.data.data);
    } catch (error) {
      throw handleApiError(error, 'Failed to update employee details.');
    }
  }

  // Override delete to add error handling
  async delete(id: string): Promise<boolean> {
    try {
      const response = await api.delete<DeleteResponse>(this.endpoints.DETAIL(id));
      return response.data.success;
    } catch (error) {
      throw handleApiError(error, 'Failed to delete employee.');
    }
  }

  // ==========================================================================
  // Entity-specific methods
  // ==========================================================================

  /**
   * Upload documents for an employee
   */
  async uploadDocuments(userId: string, documents: File[]): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData();
      documents.forEach((file) => {
        formData.append('documents', file);
      });

      const response = await api.post<DocumentUploadResponse>(
        API_ENDPOINTS.users.DOCUMENTS(userId),
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      return response.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to upload documents.');
    }
  }

  /**
   * Delete a document from an employee
   */
  async deleteDocument(userId: string, documentId: string): Promise<{ success: boolean }> {
    try {
      const response = await api.delete<DeleteResponse>(
        API_ENDPOINTS.users.DOCUMENT_DETAIL(userId, documentId)
      );
      return { success: response.data.success };
    } catch (error) {
      throw handleApiError(error, 'Failed to delete document.');
    }
  }

  /**
   * Set supervisors for an employee
   */
  async setSupervisors(userId: string, supervisorIds: string[]): Promise<Employee> {
    try {
      const response = await api.put<EmployeeResponse>(
        API_ENDPOINTS.users.SUPERVISORS(userId),
        { reportsTo: supervisorIds }
      );
      return this.mapToFrontend(response.data.data);
    } catch (error) {
      throw handleApiError(error, 'Failed to update supervisors.');
    }
  }

  /**
   * Fetch attendance summary for an employee
   */
  async getAttendanceSummary(
    employeeId: string,
    month: number,
    year: number
  ): Promise<AttendanceSummaryData> {
    try {
      const response = await api.get<{
        month: number;
        year: number;
        weeklyOffDay: string;
        data: {
          employee: AttendanceSummaryEmployee;
          attendance: AttendanceStats;
          attendancePercentage: string;
        };
      }>(API_ENDPOINTS.users.ATTENDANCE_SUMMARY(employeeId), {
        params: { month, year },
      });

      return {
        month: response.data.month,
        year: response.data.year,
        weeklyOffDay: response.data.weeklyOffDay,
        employee: response.data.data.employee,
        attendance: response.data.data.attendance,
        attendancePercentage: response.data.data.attendancePercentage,
      };
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch attendance summary.');
    }
  }

  /**
   * Get organization hierarchy
   */
  async getOrgHierarchy(): Promise<OrgHierarchyResponse> {
    try {
      const response = await api.get<{ success: boolean; data: OrgHierarchyResponse }>(
        API_ENDPOINTS.users.ORG_HIERARCHY
      );
      return response.data.data;
    } catch (error) {
      throw handleApiError(error, 'Failed to fetch organization hierarchy.');
    }
  }
}

// Create singleton instance
const employeeRepositoryInstance = new EmployeeRepositoryClass();

// =============================================================================
// 7. Public API - Service Object (Backward Compatible)
// =============================================================================

export const EmployeeRepository = {
  // Standard CRUD (from BaseRepository)
  getAll: () => employeeRepositoryInstance.getAll(),
  getById: (id: string) => employeeRepositoryInstance.getById(id),
  create: (data: CreateEmployeeData) => employeeRepositoryInstance.create(data),
  update: (id: string, data: UpdateEmployeeData) => employeeRepositoryInstance.update(id, data),
  delete: (id: string) => employeeRepositoryInstance.delete(id),

  // Document operations
  uploadDocuments: (userId: string, documents: File[]) =>
    employeeRepositoryInstance.uploadDocuments(userId, documents),
  deleteDocument: (userId: string, documentId: string) =>
    employeeRepositoryInstance.deleteDocument(userId, documentId),

  // Hierarchy operations
  setSupervisors: (userId: string, supervisorIds: string[]) =>
    employeeRepositoryInstance.setSupervisors(userId, supervisorIds),
  getOrgHierarchy: () => employeeRepositoryInstance.getOrgHierarchy(),

  // Attendance
  getAttendanceSummary: (employeeId: string, month: number, year: number) =>
    employeeRepositoryInstance.getAttendanceSummary(employeeId, month, year),
};

// =============================================================================
// 8. Legacy Named Exports (Backward Compatibility)
// =============================================================================

/** @deprecated Use EmployeeRepository.getAll() */
export const getEmployees = EmployeeRepository.getAll;

/** @deprecated Use EmployeeRepository.getById() */
export const getEmployeeById = EmployeeRepository.getById;

/** @deprecated Use EmployeeRepository.create() */
export const addEmployee = EmployeeRepository.create;

/** @deprecated Use EmployeeRepository.update() */
export const updateEmployee = EmployeeRepository.update;

/** @deprecated Use EmployeeRepository.delete() */
export const deleteEmployee = EmployeeRepository.delete;

/** @deprecated Use EmployeeRepository.uploadDocuments() */
export const uploadEmployeeDocuments = EmployeeRepository.uploadDocuments;

/** @deprecated Use EmployeeRepository.deleteDocument() */
export const deleteEmployeeDocument = EmployeeRepository.deleteDocument;

/** @deprecated Use EmployeeRepository.setSupervisors() */
export const setUserSupervisors = EmployeeRepository.setSupervisors;

/** @deprecated Use EmployeeRepository.getAttendanceSummary() */
export const fetchAttendanceSummary = EmployeeRepository.getAttendanceSummary;

/** @deprecated Use EmployeeRepository.getOrgHierarchy() */
export const getOrgHierarchy = EmployeeRepository.getOrgHierarchy;
