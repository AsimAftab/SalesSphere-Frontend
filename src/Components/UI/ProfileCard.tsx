// src/components/UI/ProfileCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import svgBackgroundUrl from '../../assets/Image/Employeecard_bg.svg';

// --- ADDED: Interface to define the types for the component's props ---
interface ProfileCardProps {
  title: string;
  subtitle: string;
  identifier: string;
  imageUrl: string;
  basePath: string;
}

// --- MODIFIED: Applied the ProfileCardProps interface ---
const ProfileCard: React.FC<ProfileCardProps> = ({ title, subtitle, identifier, imageUrl, basePath }) => {
  // Generate a URL-friendly slug from the title
  const slug = title.toLowerCase().replace(/\s+/g, '-');

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
        <img
          className="h-20 w-20 rounded-full object-cover mb-4 ring-2 ring-slate-600"
          src={imageUrl}
          alt={title}
          // Fallback image in case the provided imageUrl fails
          onError={(e) => { 
            e.currentTarget.onerror = null; 
            e.currentTarget.src = `https://placehold.co/80x80/1E293B/FFFFFF?text=${(typeof title === 'string' && title.length > 0 ? title.charAt(0) : '?')}`; 
          }}
        />
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-sm text-blue-300">{subtitle}</p>
        <p className="mt-2 text-sm text-gray-400 break-all">{identifier}</p>
      </div>
    </Link>
  );
};

export default ProfileCard;