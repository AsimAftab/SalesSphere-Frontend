
import axios from 'axios';
import { type ModulePermissions } from '../Pages/AdminPanelPage/admin.types'; //


export const updateRolePermissions = async (permissions: Record<string, ModulePermissions>) => {
  try {
    // Replace with your actual SalesSphere production endpoint
    const response = await axios.put('/api/admin/roles/permissions', { 
      permissions 
    });
    
    return response.data;
  } catch (error) {
    // Explicit error handling for enterprise debugging
    console.error('Failed to update role permissions:', error);
    throw error;
  }
};