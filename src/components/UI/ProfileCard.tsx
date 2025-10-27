import React from 'react';
import { Link } from 'react-router-dom';
import svgBackgroundUrl from '../../assets/Image/Employeecard_bg.svg';

interface ProfileCardProps {
    title: string;
    subtitle?: string; // For Employee/Site location
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

const ProfileCard: React.FC<ProfileCardProps> = ({
    title,
    subtitle,
    identifier,
    imageUrl,
    basePath,
    role,
    phone,
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

    // Show placeholder for Prospect, Party, AND Site
    const showPlaceholder = cardType === 'prospect' || cardType === 'party' || cardType === 'site';

    return (
        <Link to={detailPath} className="block h-full">
            <div
                className="text-white p-4 rounded-2xl flex flex-col items-center text-center shadow-lg h-full transition-transform transform hover:scale-[1.03]"
                style={{
                    backgroundImage: `url(${svgBackgroundUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Conditional Rendering based on showPlaceholder */}
                <div className="mb-4 h-20 w-20 flex-shrink-0">
                    {showPlaceholder ? (
                        // Placeholder for Prospect, Party, Site
                        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center ring-2 ring-slate-600">
                            <span className="text-4xl font-semibold text-white">{initial}</span>
                        </div>
                    ) : (
                        // Image for Employee (with onError fallback)
                        <img
                            className="h-20 w-20 rounded-full object-cover ring-2 ring-slate-600"
                            src={imageUrl || `https://placehold.co/80x80/1E313B/FFFFFF?text=${initial}`}
                            alt={title}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://placehold.co/80x80/1E313B/FFFFFF?text=${initial}`;
                            }}
                        />
                    )}
                </div>

                <h3 className="text-xl font-bold mb-1">{title}</h3>

                {/* Conditional content based on cardType */}
                {cardType === 'party' || cardType === 'prospect' || cardType === 'site' ? (
                    <>
                        {ownerName && (
                            <p className="text-base text-blue-300 mt-2 font-medium">
                                Owner: {ownerName}
                            </p>
                        )}
                        {address && (
                            <div className="flex items-center justify-center text-xs text-slate-300 mt-2 px-2">
                                <span className="line-clamp-2 break-words">{address}</span>
                            </div>
                        )}
                    </>
                ) : cardType === 'employee' ? (
                    <>
                        {role && <p className="text-base text-blue-300 mt-2 font-medium">Role: {role}</p>}
                        {phone && <p className="mt-2 text-sm text-gray-300 break-words">{phone}</p>}
                        {subtitle && <p className="text-sm text-blue-300 mb-0.5">{subtitle}</p>}
                        {identifier && <p className="mt-1 text-sm text-gray-400 break-all">{identifier}</p>}
                    </>
                ) : (
                    <>
                        {subtitle && <p className="text-sm text-blue-300 mb-0.5">{subtitle}</p>}
                        {identifier && <p className="mt-1 text-sm text-gray-400 break-all">{identifier}</p>}
                    </>
                )}
            </div>
        </Link>
    );
};

export default ProfileCard;
