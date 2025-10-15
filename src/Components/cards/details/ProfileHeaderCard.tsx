import React from 'react';

interface ProfileHeaderCardProps {
  imageUrl: string;
  name: string;
  title: string;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ imageUrl, name, title }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
      <img
        src={imageUrl}
        alt={name}
        className="h-24 w-24 rounded-full object-cover mb-4 ring-2 ring-offset-2 ring-blue-500"
      />
      <h2 className="text-xl font-bold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
};

export default ProfileHeaderCard;