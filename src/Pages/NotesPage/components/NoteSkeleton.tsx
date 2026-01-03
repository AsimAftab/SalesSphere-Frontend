import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface NoteSkeletonProps {
  rows?: number;
}

const NoteSkeleton: React.FC<NoteSkeletonProps> = ({ rows = 10 }) => {
  return (
    <div className="w-full flex flex-col p-4 sm:p-0">
      
      {/* 1. Header Skeleton - Mimics NoteHeader */}
      <div className="w-full flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="text-left shrink-0">
          <Skeleton width={200} height={28} className="mb-2" />
          <Skeleton width={250} height={14} />
        </div>

        <div className="flex flex-row flex-wrap items-center justify-start lg:justify-end gap-4 w-full">
                {/* Search Bar placeholder */}
                <div className="relative w-full lg:w-80">
                  <Skeleton height={40} borderRadius={20} />
                </div>
                
                {/* Action Buttons (Filter Toggle, PDF, Excel) */}
                <div className="flex items-center gap-3">
                  <Skeleton width={42} height={42} borderRadius={8} /> 
                  <Skeleton width={80} height={42} borderRadius={8} /> 
                  <Skeleton width={80} height={42} borderRadius={8} /> 
                </div>
        
                {/* Create Button placeholder */}
                <Skeleton width={160} height={42} borderRadius={8} />
              </div>
      </div>

      {/* 2. Desktop Table Skeleton - Mimics NoteTable (8 columns) */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full border-collapse">
          
          <tbody className="divide-y divide-gray-50">
            {Array(rows).fill(0).map((_, i) => (
              <tr key={i} className="h-16">
                <td className="px-5 py-4"><Skeleton width={18} height={18} /></td>
                <td className="px-5 py-4"><Skeleton width={30} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={140} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={100} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={80} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={180} height={14} /></td>
                <td className="px-5 py-4"><Skeleton width={70} height={22} borderRadius={4} /></td>
                <td className="px-5 py-4"><Skeleton width={80} height={14} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Mobile List Skeleton - Mimics NoteMobileList Cards */}
      <div className="md:hidden w-full space-y-4 pb-10">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            {/* Top Row: Checkbox + Badge + Date */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Skeleton width={20} height={20} borderRadius={4} />
                <Skeleton width={60} height={18} borderRadius={4} />
              </div>
              <Skeleton width={70} height={12} />
            </div>
            
            {/* Title & Description */}
            <div className="mb-4 space-y-2">
              <Skeleton width="80%" height={16} />
              <Skeleton count={2} height={12} />
            </div>
            
            {/* Metadata Footer */}
            <div className="flex justify-between mb-4 border-t pt-3">
              <Skeleton width={100} height={12} />
              <Skeleton width={60} height={12} />
            </div>
            
            {/* Action Button */}
            <Skeleton width="100%" height={40} borderRadius={8} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteSkeleton;