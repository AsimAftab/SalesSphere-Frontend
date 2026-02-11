import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { InfoBlock, Button, DetailPageHeader } from '@/components/ui';
import { useSystemUserDetails } from './hooks/useSystemUserDetails';
import { useSystemUserActions } from './hooks/useSystemUserActions';
import EmployeeModal from '@/components/modals/Employees/EmployeeModal';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import SystemUserDetailsSkeleton from './components/SystemUserDetailsSkeleton';
import { formatRoleName, getAvatarUrl, SYSTEM_USER_INFO_FIELDS } from './utils';

const SystemUserDetailsPage = () => {
    const navigate = useNavigate();
    const { systemUser, isLoading, error, refetch } = useSystemUserDetails();

    const {
        isEditModalOpen,
        setIsEditModalOpen,
        isDeleteConfirmOpen,
        setIsDeleteConfirmOpen,
        handleSave,
        handleDelete,
    } = useSystemUserActions({ systemUser, refetch });

    if (isLoading) {
        return <SystemUserDetailsSkeleton />;
    }

    if (error || !systemUser) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-red-500">
                <p>{error || 'System user not found'}</p>
                <Button variant="outline" onClick={() => navigate(-1)} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    const imageUrl = getAvatarUrl(systemUser.avatarUrl, systemUser.name);
    const roleName = formatRoleName(systemUser.role);

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                {/* Header */}
                <DetailPageHeader
                    title="System User Details"
                    backPath="/system-users"
                    backLabel="Back to System Users"
                    actions={
                        <>
                            <Button variant="primary" onClick={() => setIsEditModalOpen(true)} className="w-full sm:w-auto h-11 px-6 font-bold shadow-sm">
                                Edit System User
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteConfirmOpen(true)}
                                className="w-full sm:w-auto h-11 px-6 font-bold shadow-sm border-red-200 text-red-600 hover:bg-red-50"
                            >
                                Delete System User
                            </Button>
                        </>
                    }
                />

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Combined Profile + Info Card */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8 h-fit">
                        {/* Avatar + Name Row */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left">
                            <img
                                src={imageUrl}
                                alt={systemUser.name}
                                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-2 ring-offset-2 ring-blue-500 flex-shrink-0"
                            />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{systemUser.name}</h2>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                                    {roleName}
                                </span>
                            </div>
                        </div>

                        <hr className="border-gray-200 mb-6" />

                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Personal Information</h3>
                        </div>

                        {/* InfoBlock Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                            {SYSTEM_USER_INFO_FIELDS.map((field) => (
                                <InfoBlock
                                    key={field.label}
                                    icon={field.icon}
                                    label={field.label}
                                    value={field.getValue(systemUser, roleName)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Edit Modal */}
            {systemUser && (
                <EmployeeModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    mode="edit"
                    variant="system-user"
                    initialData={systemUser}
                    onSave={handleSave}
                />
            )}

            {/* Delete Confirmation Modal */}
            {systemUser && (
                <ConfirmationModal
                    isOpen={isDeleteConfirmOpen}
                    title="Delete System User"
                    message={`Are you sure you want to delete "${systemUser.name}"? This action cannot be undone.`}
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteConfirmOpen(false)}
                    confirmButtonText="Delete System User"
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};

export default SystemUserDetailsPage;
