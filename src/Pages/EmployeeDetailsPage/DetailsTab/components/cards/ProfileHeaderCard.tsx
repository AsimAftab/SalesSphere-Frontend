import React, { useState } from 'react';
import ImagePreviewModal from '../../../../../components/modals/Image/ImagePreviewModal';

interface ProfileHeaderCardProps {
  imageUrl: string;
  name: string;
  title: string;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ imageUrl, name, title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center">
        <div
          className="cursor-pointer group relative"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={imageUrl}
            alt={name}
            className="h-24 w-24 rounded-full object-cover mb-4 ring-2 ring-offset-2 ring-blue-500 group-hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full h-24 w-24 mb-4">
            <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-md font-semibold text-gray-500">{title}</p>
      </div>

      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={[{
          url: imageUrl,
          description: `${name}'s Profile Photo`
        }]}
      />
    </>
  );
};

export default ProfileHeaderCard;