import { useState, useEffect } from 'react';
import { systemUserService } from '@/api/SuperAdmin/systemUserService';
import type { SystemUser } from '@/api/SuperAdmin/systemUserService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/SuperadminComponents/card';
import { CircleUser, Loader2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AddSystemUserModal } from '@/components/modals/superadmin/AddSystemUserModal';
import { Button as CustomButton, StatusBadge } from '@/components/ui';

export default function SystemUserListPage() {
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await systemUserService.getAll();
            setUsers(data.data); // getAll returns { success, data } based on service def, but let's double check service return type.
            // systemUserService.getAll returns response.data which is { success: boolean; data: SystemUser[] } ? 
            // NO, look at service: return response.data; where response is axios response. 
            // response.data is { success: boolean, data: SystemUser[] }. 
            // SO usage should be data.data.
            // WAIT, looking at service file again:
            // getAll: async () => { const response = await api.get...; return response.data; }
            // So it returns { success: boolean; data: SystemUser[] }
            // So setUsers(data.data) is correct.
        } catch (error) {
            console.error("Error fetching system users:", error);
            toast.error("Failed to load system users");
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (userData: {
        name: string;
        email: string;
        phone: string;
        role: "superadmin" | "Developer";
        position: string;
        dob?: string;
        citizenship?: string;
        gender?: string;
        location?: string;
    }) => {
        try {
            const formData = new FormData();
            formData.append('name', userData.name);
            formData.append('email', userData.email);
            formData.append('phone', userData.phone);
            // formData.append('role', userData.role.toLowerCase()); // Role might need lowercase
            // checking service: role?: 'superadmin' | 'developer';
            const role = userData.role === 'Developer' ? 'developer' : 'superadmin';
            formData.append('role', role);

            if (userData.dob) formData.append('dateOfBirth', userData.dob);
            if (userData.citizenship) formData.append('citizenshipNumber', userData.citizenship);
            if (userData.gender) formData.append('gender', userData.gender);
            if (userData.location) formData.append('address', userData.location);

            await systemUserService.create(formData);
            toast.success("User added successfully");
            setIsAddUserModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Failed to add user");
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">System Users</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage Super Admins and Developers with access to the admin panel.
                    </p>
                </div>
                <CustomButton onClick={() => setIsAddUserModalOpen(true)} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Add User
                </CustomButton>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users.map((user) => (
                    <Card
                        key={user.id || user._id}
                        className="hover:shadow-md transition-all"
                    >
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                            ) : (
                                <CircleUser className="h-12 w-12 text-gray-300" />
                            )}
                            <div className="flex flex-col">
                                <CardTitle className="text-base">{user.name}</CardTitle>
                                <CardDescription className="text-xs truncate max-w-[150px]" title={user.email}>
                                    {user.email}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                    {user.role}
                                </span>
                                <StatusBadge status={user.isActive ? 'Active' : 'Inactive'} />
                            </div>
                            {/* user.lastActive removed as it does not exist on type */}
                            {/* <p className="text-xs text-muted-foreground mt-4">
                                Last active: ...
                            </p> */}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AddSystemUserModal
                isOpen={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onAdd={handleAddUser}
            />
        </div>
    );
}
