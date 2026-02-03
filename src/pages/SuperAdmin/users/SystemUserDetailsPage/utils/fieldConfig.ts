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
    {
        key: 'dateOfBirth',
        icon: Calendar,
        label: 'Date of Birth',
        getValue: (user) => formatDateOfBirth(user.dateOfBirth),
    },
    {
        key: 'gender',
        icon: UserCircle,
        label: 'Gender',
        getValue: (user) => user.gender || 'N/A',
    },
    {
        key: 'roleName',
        icon: Briefcase,
        label: 'Role',
        getValue: (_, roleName) => roleName || 'N/A',
    },
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
    {
        key: 'address',
        icon: MapPin,
        label: 'Address',
        getValue: (user) => user.address || 'N/A',
    },
    {
        key: 'dateJoined',
        icon: Calendar,
        label: 'Date Joined',
        getValue: (user) => formatDate(user.dateJoined),
    },
];
