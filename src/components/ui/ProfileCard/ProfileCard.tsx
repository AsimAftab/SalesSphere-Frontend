import React from 'react';

interface ProfileCardProps {
    title: string;
    identifier?: string; // For Employee email or Site ID
    imageUrl?: string | null;
    basePath: string;
    role?: string; // Employee role
    phone?: string; // Employee phone
    ownerName?: string; // For Party/Prospect/Site
    address?: string; // For Party/Prospect/Site

    id?: string | number;
    cardType: 'employee' | 'prospect' | 'party' | 'site';
}

import { ProfileCardUI } from './ProfileCardUI';

const ProfileCard: React.FC<ProfileCardProps> = ({
    title,
    role,
    phone,
    identifier,
    imageUrl,
    basePath,
    ownerName,
    address,
    id,
    cardType
}) => {
    const slug = id ?? identifier ?? title.toLowerCase().replace(/\s+/g, '-');
    const detailPath = `${basePath}/${slug}`;

    const initial = typeof title === 'string' && title.length > 0
        ? title.charAt(0).toUpperCase()
        : '?';

    // Logic: Determine if it's a placeholder type
    const showPlaceholder = cardType === 'prospect' || cardType === 'party' || cardType === 'site';

    // Logic: Determine Content based on Card Type (SRP: Content Strategy)
    const renderContent = () => {
        if (cardType === 'party' || cardType === 'prospect' || cardType === 'site') {
            return (
                <>
                    {ownerName && (
                        <p className="text-base text-blue-300 mt-2 font-medium">
                            Owner: {ownerName}
                        </p>
                    )}
                    {address && (
                        <div className="flex items-center justify-center text-xs text-slate-300 mt-2 px-2">
                            <span className="line-clamp-2 break-words">
                                {address.split(',').slice(0, 3).join(', ')}
                            </span>
                        </div>
                    )}
                </>
            );
        }

        if (cardType === 'employee') {
            return (
                <>
                    {role && <p className="text-base text-blue-300 mt-2 font-medium">Role: {role}</p>}
                    {phone && <p className="mt-2 text-sm text-gray-300 break-words">{phone}</p>}
                </>
            );
        }
        return null;
    };

    return (
        <ProfileCardUI
            to={detailPath}
            title={title}
            initial={initial}
            imageUrl={imageUrl}
            showPlaceholder={showPlaceholder}
        >
            {renderContent()}
        </ProfileCardUI>
    );
};

export default ProfileCard;
