import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import svgBackgroundUrl from '../../../assets/Image/Employeecard_bg.svg';

interface ProfileCardUIProps {
    to: string;
    title: string;
    initial: string;
    imageUrl?: string | null;
    showPlaceholder: boolean;
    children: ReactNode;
}

export const ProfileCardUI: React.FC<ProfileCardUIProps> = ({
    to,
    title,
    initial,
    imageUrl,
    showPlaceholder,
    children,
}) => {
    return (
        <Link to={to} className="block h-full">
            <div
                className="text-white p-4 rounded-2xl flex flex-col items-center text-center shadow-lg h-full transition-transform transform hover:scale-[1.03]"
                style={{
                    backgroundImage: `url(${svgBackgroundUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="mb-4 h-20 w-20 flex-shrink-0 relative">
                    {showPlaceholder ? (
                        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center ring-2 ring-white shadow-xl">
                            <span className="text-3xl font-bold text-white tracking-widest">{initial}</span>
                        </div>
                    ) : (
                        <img
                            className="h-20 w-20 rounded-full object-cover border-2 ring-2 ring-white/10 shadow-2xl bg-white"
                            src={imageUrl || `https://placehold.co/80x80/1E313B/FFFFFF?text=${initial}`}
                            alt={title}
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = `https://placehold.co/80x80/1E313B/FFFFFF?text=${initial}`;
                            }}
                        />
                    )}
                </div>

                <h3 className="text-xl font-bold mb-3 tracking-wide drop-shadow-sm">{title}</h3>

                <div className="w-full space-y-2 px-2">
                    {children}
                </div>
            </div>
        </Link>
    );
};
