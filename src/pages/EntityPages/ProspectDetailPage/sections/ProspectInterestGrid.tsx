import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

interface InterestItem {
  category: string;
  brands: string[];
}

interface ProspectInterestGridProps {
  interests?: InterestItem[];
}


const ProspectInterestGrid: React.FC<ProspectInterestGridProps> = ({ interests }) => {
  const hasInterests = interests && interests.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
            <Tag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              Interest Categories
            </h3>
            <p className="text-sm text-gray-500 hidden sm:block">
              Categories and brands the prospect is interested in.
            </p>
          </div>
        </div>
        
        {hasInterests && (
          <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-full border border-gray-200">
            {interests.length} {interests.length === 1 ? 'Category' : 'Categories'}
          </span>
        )}
      </div>

      {/* Content Grid - Using your original responsive column logic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
        {hasInterests ? (
          interests.map((item, index) => (
            <InterestCard key={`${item.category}-${index}`} item={item} index={index} />
          ))
        ) : (
          /* Empty State */
          <div className="col-span-full flex flex-col items-center justify-center py-6 text-center">
            <h4 className="text-base font-semibold text-gray-800">No Interest Categories</h4>
            <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
              This prospect hasn't expressed interest in any specific categories or brands yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Sub-component for individual cards (SRP)
 */
const InterestCard = ({ item, index }: { item: InterestItem; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    transition={{ delay: index * 0.05 }}
    className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 h-full group"
  >
    {/* Category Header */}
    <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
      <h4 
        className="font-semibold text-gray-900 text-sm uppercase truncate leading-snug" 
        title={item.category}
      >
        {item.category}
      </h4>
    </div>

    {/* Brands Body */}
    <div className="p-4 flex-1 flex flex-col">
      <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Brands</p>
      <div className="flex flex-wrap gap-2 content-start">
        {item.brands && item.brands.length > 0 ? (
          item.brands.map((brand, bIndex) => (
            <span
              key={bIndex}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors duration-150 cursor-default"
            >
              {brand}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400 italic">No brands specified</span>
        )}
      </div>
    </div>
  </motion.div>
);

export default ProspectInterestGrid;