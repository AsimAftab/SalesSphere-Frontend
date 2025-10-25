// src/components/UI/ProfileCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import svgBackgroundUrl from '../../assets/Image/Employeecard_bg.svg';

// --- ADDED: Interface to define the types for the component's props ---
interface ProfileCardProps {
	title: string;
	subtitle?: string;
	identifier?: string;
	imageUrl?: string;
	basePath: string;
	// New fields for party cards
	ownerName?: string;
	address?: string;
	id?: string; // Party ID for direct URL routing
}

// --- MODIFIED: Applied the ProfileCardProps interface ---
const ProfileCard: React.FC<ProfileCardProps> = ({
	title,
	subtitle,
	identifier,
	imageUrl,
	basePath,
	ownerName,
	address,
	id
}) => {
	// Use provided ID or generate a URL-friendly slug from the title
	const slug = id || title.toLowerCase().replace(/\s+/g, '-');

	// Determine if this is a party card (has ownerName or address)
	const isPartyCard = ownerName || address;

	return (
		<Link to={`${basePath}/${slug}`} className="block h-full">
			<div
				className="text-white p-4 rounded-2xl flex flex-col items-center text-center shadow-lg h-full"
				style={{
					backgroundImage: `url(${svgBackgroundUrl})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				{imageUrl ? (
					<img
						className="h-20 w-20 rounded-full object-cover mb-4 ring-2 ring-slate-600"
						src={imageUrl}
						alt={title}
						// Fallback image in case the provided imageUrl fails
						onError={(e) => {
							e.currentTarget.onerror = null;
							e.currentTarget.src = `https://placehold.co/80x80/1E313B/FFFFFF?text=${(typeof title === 'string' && title.length > 0 ? title.charAt(0) : '?')}`;
						}}
					/>
				) : (
					// Top spacer: half of image space (h-20 + mb-4 = 96px total, split to 48px top)
					<div className="h-12" aria-hidden="true"></div>
				)}
				<h3 className="text-xl font-bold">{title}</h3>

				{/* For party cards, display owner and address */}
				{isPartyCard ? (
					<>
						{ownerName && (
							<p className="text-base text-blue-300 mt-3 font-medium">
								Owner: {ownerName}
							</p>
						)}
						{address && (
							<p className="mt-3 text-sm text-gray-300 break-words line-clamp-2 px-2">
								{address}
							</p>
						)}
					</>
				) : (
					/* For employee/other cards, display subtitle and identifier */
					<>
						{subtitle && <p className="text-sm text-blue-300">{subtitle}</p>}
						{identifier && <p className="mt-2 text-sm text-gray-400 break-all">{identifier}</p>}
					</>
				)}

				{/* Bottom spacer: only for party cards without images (48px bottom to match top) */}
				{!imageUrl && <div className="h-10 mt-3" aria-hidden="true"></div>}
			</div>
		</Link>
	);
};

export default ProfileCard;
