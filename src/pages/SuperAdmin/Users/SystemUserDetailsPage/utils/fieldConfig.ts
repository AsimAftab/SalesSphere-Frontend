/**
 * System User - Field Configuration
 * Defines the structure and display configuration for system user information fields
 */

import {
    Mail,
    Phone,
    Calendar,
    MapPin,
    CreditCard,
    Briefcase,
    UserCircle,
} from 'lucide-react';
import type { SystemUser } from '@/api/SuperAdmin/systemUserService';
import { formatDisplayDate, getAge } from '@/utils/dateUtils';

export interface InfoField {
    key: keyof SystemUser | 'dateOfBirth' | 'roleName';
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    getValue: (user: SystemUser, roleName?: string) => string;
}

/**
 * Configuration for system user information fields
 * Used to generate InfoBlock components dynamically
 */
export const SYSTEM_USER_INFO_FIELDS: InfoField[] = [
    // Row 1: Email and Phone
    {
        key: 'email',
        icon: Mail,
        label: 'Email',
        getValue: (user) => user.email || 'N/A',
    },
    {
        key: 'phone',
        icon: Phone,
        label: 'Phone',
        getValue: (user) => user.phone || 'N/A',
    },
    // Row 2: Gender and Date of Birth
    {
        key: 'gender',
        icon: UserCircle,
        label: 'Gender',
        getValue: (user) => user.gender || 'N/A',
    },
    {
        key: 'dateOfBirth',
        icon: Calendar,
        label: 'Date of Birth',
        getValue: (user) => {
            if (!user.dateOfBirth) return 'N/A';
            const formattedDate = formatDisplayDate(user.dateOfBirth);
            const age = getAge(user.dateOfBirth);
            return age !== null && age !== undefined ? `${formattedDate} (${age} years)` : formattedDate;
        },
    },
    // Row 3: Role and Date Joined
    {
        key: 'roleName',
        icon: Briefcase,
        label: 'Role',
        getValue: (_, roleName) => roleName || 'N/A',
    },
    {
        key: 'dateJoined',
        icon: Calendar,
        label: 'Date Joined',
        getValue: (user) => user.dateJoined ? formatDisplayDate(user.dateJoined) : 'N/A',
    },
    // Row 4: Citizenship Number and PAN Number
    {
        key: 'citizenshipNumber',
        icon: CreditCard,
        label: 'Citizenship Number',
        getValue: (user) => user.citizenshipNumber || 'N/A',
    },
    {
        key: 'panNumber',
        icon: CreditCard,
        label: 'PAN Number',
        getValue: (user) => user.panNumber || 'N/A',
    },
    // Row 5: Address (full width)
    {
        key: 'address',
        icon: MapPin,
        label: 'Address',
        getValue: (user) => user.address || 'N/A',
    },
];
