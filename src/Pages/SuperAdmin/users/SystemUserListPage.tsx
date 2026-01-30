import { useState, useEffect } from 'react';
import {
    PlusIcon,
    UserCircleIcon // Fallback for Avatar
} from '@heroicons/react/24/outline';
import { getAllSystemUsers, addSystemUser } from '../../../api/SuperAdmin/systemUserService';
import type { SystemUser } from '../../../api/SuperAdmin/systemUserService';
import CustomButton from '../../../components/UI/Button/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/UI/SuperadminComponents/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AddSystemUserModal } from '../../../components/modals/superadmin/AddSystemUserModal';
import { StatusBadge } from '../../../components/UI/statusBadge/statusBadge';

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
            const data = await getAllSystemUsers();
            setUsers(data);
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
            // Map modal fields to service expected fields
            const serviceData = {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role,
                dateOfBirth: userData.dob,
                citizenshipNumber: userData.citizenship,
                gender: userData.gender,
                address: userData.location
            };

            await addSystemUser(serviceData);
            toast.success("User added successfully");
            setIsAddUserModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Failed to add user");
        }
    };

    // handleUserClick removed

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
                    <PlusIcon className="mr-2 h-4 w-4" /> Add User
                </CustomButton>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {users.map((user) => (
                    <Card
                        key={user.id}
                        className="hover:shadow-md transition-all"
                    // onClick removed
                    >
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
                            ) : (
                                <UserCircleIcon className="h-12 w-12 text-gray-300" />
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
                            {user.lastActive && (
                                <p className="text-xs text-muted-foreground mt-4">
                                    Last active: {user.lastActive}
                                </p>
                            )}
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
