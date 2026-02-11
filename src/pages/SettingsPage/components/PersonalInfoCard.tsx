import React from 'react';
import { getSafeImageUrl } from '@/utils/security';
import type { UserProfile } from '@/api/settingService';
import { InfoBlock } from '@/components/ui';
import {
  Briefcase,
  CalendarDays,
  CircleUser,
  FileText,
  IdCard,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import { formatDisplayDate, getAge } from '@/utils/dateUtils';
import { getAvatarUrl, resolveUserRole } from '@/utils/userUtils';

interface PersonalInfoCardProps {
  userData: UserProfile;
  isSuperAdmin: boolean;
}

const formatDob = (dob: string | undefined): string => {
  if (!dob) return 'N/A';
  return formatDisplayDate(dob);
};

const calculateAge = (dob: string | undefined): string => {
  if (!dob) return 'N/A';
  const age = getAge(dob);
  return age !== null ? `${age} years` : 'N/A';
};

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ userData, isSuperAdmin }) => {
  const name = userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Unknown User';
  const safeUrl = getSafeImageUrl(userData.avatar || userData.photoPreview);
  const imageUrl = safeUrl || getAvatarUrl(null, name);
  const role = resolveUserRole(userData, 'N/A');
  const dob = userData.dateOfBirth || userData.dob;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Top: Avatar + Name Row */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-offset-2 ring-blue-500"
          />
        </div>

        {/* Name & Role */}
        <div className="text-center sm:text-left flex flex-col justify-center">
          <h2 className="text-xl font-bold text-gray-800">{name}</h2>
          <p className="text-md font-semibold text-gray-500">{role}</p>
        </div>
      </div>

      <hr className="border-gray-200 -mx-8 mb-6" />

      {/* Section Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-black text-black">Personal Information</h3>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
        <InfoBlock icon={Mail} label="Email Address" value={userData.email} />
        <InfoBlock icon={Phone} label="Phone Number" value={userData.phone} />
        <InfoBlock icon={CalendarDays} label="Date of Birth" value={dob ? `${formatDob(dob)} (${calculateAge(dob)})` : 'N/A'} />
        <InfoBlock icon={CircleUser} label="Gender" value={userData.gender} />
        {!isSuperAdmin && (
          <>
            <InfoBlock icon={Briefcase} label="Role" value={role} />
            <InfoBlock icon={FileText} label="PAN Number" value={userData.panNumber || userData.pan} />
          </>
        )}
        <InfoBlock icon={IdCard} label="Citizenship Number" value={userData.citizenshipNumber || userData.citizenship} />
        <InfoBlock icon={MapPin} label="Location" value={userData.address || userData.location} />
      </div>
    </div>
  );
};

export default PersonalInfoCard;
