import api from './api';
import type {
    Role,
    CreateRolePayload,
    UpdateRolePayload,
    BackendModulePermissions
} from '../Pages/AdminPanelPage/PermissionTab/types/admin.types';

// --- 1. Interfaces ---

export interface FeatureRegistry {
    [moduleName: string]: {
        [featureKey: string]: string; // feature key -> description
    };
}

export interface ModuleInfo {
    key: string;
    label: string;
}

interface ApiResponse<T> {
    status: string;
    data: T;
    message?: string;
    count?: number;
}

// --- 2. Mapper Logic ---
class RoleMapper {
    static toFrontendRegistry(modules: any[]): FeatureRegistry {
        // Backend: [{ key: "attendance", features: [{ key: "viewMyAttendance", description: "..." }] }]
        // Frontend: { attendance: { viewMyAttendance: "..." } }
        const registry: FeatureRegistry = {};

        modules.forEach((module: any) => {
            const moduleKey = module.key;
            const features: { [key: string]: string } = {};

            // Convert features array to object
            if (Array.isArray(module.features)) {
                module.features.forEach((feature: any) => {
                    features[feature.key] = feature.description;
                });
            }

            registry[moduleKey] = features;
        });

        return registry;
    }
}

// --- 3. Centralized Endpoints ---
const ENDPOINTS = {
    ROLES: '/roles',
    ROLE_DETAIL: (id: string) => `/roles/${id}`,
    MODULES: '/roles/modules',
    ASSIGN: (roleId: string, userId: string) => `/roles/${roleId}/assign/${userId}`,
    REMOVE_ASSIGN: (userId: string) => `/roles/assign/${userId}`,
};

// --- 4. Repository Pattern ---
export const RoleRepository = {
    /**
     * Get all roles for the current organization
     */
    async getAll(): Promise<Role[]> {
        const response = await api.get<ApiResponse<Role[]>>(ENDPOINTS.ROLES);
        return response.data.data;
    },

    /**
     * Get a single role by ID
     */
    async getById(roleId: string): Promise<Role> {
        const response = await api.get<ApiResponse<Role>>(ENDPOINTS.ROLE_DETAIL(roleId));
        return response.data.data;
    },

    /**
     * Create a new role
     */
    async create(payload: CreateRolePayload): Promise<Role> {
        const response = await api.post<ApiResponse<Role>>(ENDPOINTS.ROLES, payload);
        return response.data.data;
    },

    /**
     * Update an existing role
     */
    async update(roleId: string, payload: UpdateRolePayload): Promise<Role> {
        const response = await api.put<ApiResponse<Role>>(ENDPOINTS.ROLE_DETAIL(roleId), payload);
        return response.data.data;
    },

    /**
     * Delete a role (must have no users assigned)
     */
    async delete(roleId: string): Promise<void> {
        await api.delete<ApiResponse<null>>(ENDPOINTS.ROLE_DETAIL(roleId));
    },

    /**
     * Get available modules from backend
     */
    async getModules(): Promise<ModuleInfo[]> {
        const response = await api.get<ApiResponse<ModuleInfo[]>>(ENDPOINTS.MODULES);
        return response.data.data;
    },

    /**
     * Get feature registry (modules with their features and descriptions)
     */
    async getFeatureRegistry(): Promise<FeatureRegistry> {
        const response = await api.get<ApiResponse<any[]>>(ENDPOINTS.MODULES);
        return RoleMapper.toFrontendRegistry(response.data.data || []);
    },

    /**
     * Assign a role to a user
     */
    async assignToUser(roleId: string, userId: string): Promise<{ userId: string; userName: string; roleName: string; roleId: string }> {
        const response = await api.put<ApiResponse<{ userId: string; userName: string; roleName: string; roleId: string }>>
            (ENDPOINTS.ASSIGN(roleId, userId));
        return response.data.data;
    },

    /**
     * Remove custom role from a user
     */
    async removeFromUser(userId: string): Promise<void> {
        await api.delete<ApiResponse<null>>(ENDPOINTS.REMOVE_ASSIGN(userId));
    },
};

// --- 5. Clean Named Exports (Backward Compatibility + Default) ---

// legacy 'roleService' object export, but now using repository functions
// Note: legacy consumers expected AxiosResponse, but we are changing to return Data.
// We must verify/update consumers.
export const roleService = RoleRepository;

export const {
    getAll,
    getById,
    create,
    update,
    delete: deleteRole,
    getModules,
    getFeatureRegistry,
    assignToUser,
    removeFromUser
} = RoleRepository;

// Alias exports matching old file to minimize import breakage
export const getRoles = RoleRepository.getAll;
export const createRole = RoleRepository.create;
export const updateRolePermissions = (
    roleId: string,
    permissions: Record<string, BackendModulePermissions>
) => RoleRepository.update(roleId, { permissions });
export const assignRoleToUser = RoleRepository.assignToUser;

export default RoleRepository;
