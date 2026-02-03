import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { InfoBlock, Button } from '@/components/ui';
import { useSystemUserDetails } from './hooks/useSystemUserDetails';
import { useSystemUserActions } from './hooks/useSystemUserActions';
import DocumentsCard from '@/pages/EmployeeDetailsPage/DetailsTab/components/cards/DocumentsCard';
import EmployeeModal from '@/components/modals/Employees/EmployeeModal';
import ConfirmationModal from '@/components/modals/CommonModals/ConfirmationModal';
import SystemUserDetailsSkeleton from './components/SystemUserDetailsSkeleton';
import { formatRoleName } from './utils/roleFormatters';
import { getAvatarUrl, formatDate } from './utils/formatters';
import { BRAND_COLORS } from './utils/constants';
import { SYSTEM_USER_INFO_FIELDS } from './utils/fieldConfig';
import type { SystemUserDocument } from '@/api/SuperAdmin/systemUserService';

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
        handleUploadDocument,
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

    // Map documents for display
    const documentFiles = (systemUser.documents || []).map((doc: SystemUserDocument) => ({
        _id: doc._id,
        name: doc.fileName || 'Document',
        fileUrl: doc.fileUrl,
        size: 'N/A',
        date: doc.uploadedAt ? formatDate(doc.uploadedAt) : 'N/A',
    }));

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">System User Details</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="primary"
                            onClick={() => setIsEditModalOpen(true)}
                            className={`bg-[${BRAND_COLORS.PRIMARY}] hover:bg-[${BRAND_COLORS.PRIMARY_HOVER}] text-white px-6`}
                        >
                            Edit System User
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteConfirmOpen(true)}
                            className="border-red-200 text-red-600 hover:bg-red-50 px-6"
                        >
                            Delete System User
                        </Button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Combined Profile + Info Card */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8 h-fit">
                        {/* Avatar + Name Row */}
                        <div className="flex items-center gap-6 mb-8">
                            <img
                                src={imageUrl}
                                alt={systemUser.name}
                                className="h-24 w-24 rounded-full object-cover ring-4 ring-gray-50"
                            />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{systemUser.name}</h2>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                                    {roleName}
                                </span>
                            </div>
                        </div>

                        <hr className="border-gray-100 mb-8" />

                        {/* Section Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                        </div>

                        {/* InfoBlock Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
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

                    {/* Right: Documents */}
                    <div className="flex flex-col gap-6">
                        <DocumentsCard
                            title="Documents & Files"
                            files={documentFiles}
                            onAddDocument={handleUploadDocument}
                            isUploading={false}
                        />
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
