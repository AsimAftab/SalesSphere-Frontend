import React from 'react';
import { Link } from 'react-router-dom';
import svgBackgroundUrl from '../../assets/Image/Employeecard_bg.svg';

const EmployeeCard = ({ name, designation, email, imageUrl }) => {
  return (
    <Link to={`/employees/${name.toLowerCase().replace(' ', '-')}`} className="block">
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
          alt={name}
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/80x80/1E293B/FFFFFF?text=${(typeof name === 'string' && name.length > 0 ? name.charAt(0) : '?')}`; }}
        />
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-blue-300">{designation}</p>
        <p className="mt-2 text-sm text-gray-400">{email}</p>
      </div>
    </Link>
  );
};

export default EmployeeCard;
