import api from './api';
import type {
    Role,
    CreateRolePayload,
    UpdateRolePayload,
    BackendModulePermissions
} from '../Pages/AdminPanelPage/PermissionTab/types/admin.types';

// --- Response Types ---
interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
    count?: number;
}

// --- Feature Registry Types ---
export interface FeatureRegistry {
    [moduleName: string]: {
        [featureKey: string]: string; // feature key -> description
    };
}

export interface ModuleInfo {
    key: string;
    label: string;
}

// --- Role Service (SOLID: Single Responsibility) ---
export const roleService = {
    /**
     * Get all roles for the current organization
     * @route GET /api/v1/roles
     */
    getAll: () =>
        api.get<ApiResponse<Role[]>>('/roles'),

    /**
     * Get a single role by ID
     * @route GET /api/v1/roles/:id
     */
    getById: (roleId: string) =>
        api.get<ApiResponse<Role>>(`/roles/${roleId}`),

    /**
     * Create a new role
     * @route POST /api/v1/roles
     */
    create: (payload: CreateRolePayload) =>
        api.post<ApiResponse<Role>>('/roles', payload),

    /**
     * Update an existing role
     * @route PUT /api/v1/roles/:id
     */
    update: (roleId: string, payload: UpdateRolePayload) =>
        api.put<ApiResponse<Role>>(`/roles/${roleId}`, payload),

    /**
     * Delete a role (must have no users assigned)
     * @route DELETE /api/v1/roles/:id
     */
    delete: (roleId: string) =>
        api.delete<ApiResponse<null>>(`/roles/${roleId}`),

    /**
     * Get available modules from backend
     * @route GET /api/v1/roles/modules
     */
    getModules: () =>
        api.get<ApiResponse<ModuleInfo[]>>('/roles/modules'),

    /**
     * Get feature registry (modules with their features and descriptions)
     * Transforms backend array format to frontend object format
     * @route GET /api/v1/roles/modules
     */
    getFeatureRegistry: async () => {
        const response = await api.get<ApiResponse<any[]>>('/roles/modules');

        // Transform backend array format to frontend object format
        // Backend: [{ key: "attendance", features: [{ key: "viewMyAttendance", description: "..." }] }]
        // Frontend: { attendance: { viewMyAttendance: "..." } }
        const modules = response.data.data || [];
        const registry: FeatureRegistry = {};

        modules.forEach((module: any) => {
            const moduleKey = module.key;
            const features: { [key: string]: string } = {};

            // Convert features array to object
            module.features.forEach((feature: any) => {
                features[feature.key] = feature.description;
            });

            registry[moduleKey] = features;
        });

        return {
            ...response,
            data: {
                ...response.data,
                data: registry
            }
        };
    },

    /**
     * Assign a role to a user
     * @route PUT /api/v1/roles/:roleId/assign/:userId
     */
    assignToUser: (roleId: string, userId: string) =>
        api.put<ApiResponse<{ userId: string; userName: string; roleName: string; roleId: string }>>
            (`/roles/${roleId}/assign/${userId}`),

    /**
     * Remove custom role from a user
     * @route DELETE /api/v1/roles/assign/:userId
     */
    removeFromUser: (userId: string) =>
        api.delete<ApiResponse<null>>(`/roles/assign/${userId}`),
};

// --- Legacy exports for backward compatibility ---
// These match the old adminPanelSevice.ts exports
export const getRoles = roleService.getAll;
export const createRole = roleService.create;
export const updateRolePermissions = (
    roleId: string,
    permissions: Record<string, BackendModulePermissions>
) => roleService.update(roleId, { permissions });
export const assignRoleToUser = roleService.assignToUser;

export default roleService;
