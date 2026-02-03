/**
 * System User - Field Configuration
 * Defines the structure and display configuration for system user information fields
 */

import {
    EnvelopeIcon,
    PhoneIcon,
    CalendarDaysIcon,
    MapPinIcon,
    IdentificationIcon,
    BriefcaseIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import type { SystemUser } from '@/api/SuperAdmin/systemUserService';
import { formatDate, formatDateOfBirth } from './formatters';

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
    {
        key: 'email',
        icon: EnvelopeIcon,
        label: 'Email',
        getValue: (user) => user.email || 'N/A',
    },
    {
        key: 'phone',
        icon: PhoneIcon,
        label: 'Phone',
        getValue: (user) => user.phone || 'N/A',
    },
    {
        key: 'dateOfBirth',
        icon: CalendarDaysIcon,
        label: 'Date of Birth',
        getValue: (user) => formatDateOfBirth(user.dateOfBirth),
    },
    {
        key: 'gender',
        icon: UserCircleIcon,
        label: 'Gender',
        getValue: (user) => user.gender || 'N/A',
    },
    {
        key: 'roleName',
        icon: BriefcaseIcon,
        label: 'Role',
        getValue: (_, roleName) => roleName || 'N/A',
    },
    {
        key: 'citizenshipNumber',
        icon: IdentificationIcon,
        label: 'Citizenship Number',
        getValue: (user) => user.citizenshipNumber || 'N/A',
    },
    {
        key: 'panNumber',
        icon: IdentificationIcon,
        label: 'PAN Number',
        getValue: (user) => user.panNumber || 'N/A',
    },
    {
        key: 'address',
        icon: MapPinIcon,
        label: 'Address',
        getValue: (user) => user.address || 'N/A',
    },
    {
        key: 'dateJoined',
        icon: CalendarDaysIcon,
        label: 'Date Joined',
        getValue: (user) => formatDate(user.dateJoined),
    },
];
