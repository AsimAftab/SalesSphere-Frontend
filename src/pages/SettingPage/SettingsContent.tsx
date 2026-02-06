import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import ChangePasswordModal from '@/components/modals/Settings/ChangePasswordModal';
import EditProfileModal from '@/components/modals/Settings/EditProfileModal';

import PersonalInfoCard from './components/PersonalInfoCard';
import type { UserProfile } from '@/api/settingService';
import { Button, EmptyState } from '@/components/ui';

/* ---------- Props ---------- */
interface SettingsContentProps {
  error: string | null;
  userData: UserProfile | undefined;
  onSaveProfile: (data: Record<string, unknown>) => Promise<void>;
  onChangePassword: (
    current: string,
    next: string,
  ) => Promise<{ success: boolean; message: string; field?: 'current' | 'new' }>;
  onImageUpload?: (file: File) => Promise<void>;
}

/* ---------- Animation ---------- */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

/* ---------- Component ---------- */
const SettingsContent: React.FC<SettingsContentProps> = ({
  error,
  userData,
  onSaveProfile,
  onChangePassword,
  onImageUpload,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const isSuperAdmin =
    userData?.role?.toLowerCase() === 'superadmin' ||
    userData?.role?.toLowerCase() === 'super admin';

  /* -- Guard clauses -- */
  if (error && !userData) {
    return (
      <EmptyState title="Error" description={error} variant="error" />
    );
  }

  if (!userData) return null;

  return (
    <>
      <motion.div className="relative space-y-6" variants={containerVariants} initial="hidden" animate="show">
        {/* Error banner */}
        {error && userData && (
          <div className="text-red-600 p-3 bg-red-50 rounded-lg border border-red-200 text-sm">{error}</div>
        )}

        {/* Page Header + Actions */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
          <div>
            <h1 className="text-2xl font-black text-[#202224]">Account Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your profile and security preferences.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(true)}
              className="w-full sm:w-auto h-11 px-6 font-bold shadow-sm gap-2"
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsPasswordModalOpen(true)}
              className="w-full sm:w-auto h-11 px-6 font-bold shadow-sm gap-2"
            >
              <Lock className="h-4 w-4" />
              Change Password
            </Button>
          </div>
        </motion.div>

        {/* Single Full-Width Info Card */}
        <motion.div variants={itemVariants}>
          <PersonalInfoCard userData={userData} isSuperAdmin={isSuperAdmin} />
        </motion.div>
      </motion.div>

      {/* Modals — outside motion.div to avoid transform breaking backdrop-filter */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        userData={userData}
        isSuperAdmin={isSuperAdmin}
        onSave={onSaveProfile}
        onImageUpload={onImageUpload}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onChangePassword={onChangePassword}
      />
    </>
  );
};

export default SettingsContent;
