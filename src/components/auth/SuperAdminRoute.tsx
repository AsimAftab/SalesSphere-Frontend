import React from 'react';
import RoleBasedRoute from './RoleBasedRoute';

const SuperAdminRoute: React.FC = () => {
  return <RoleBasedRoute allowedRoles={['superadmin', 'super admin', 'developer']} redirectTo="/dashboard" />;
};

export default SuperAdminRoute;
