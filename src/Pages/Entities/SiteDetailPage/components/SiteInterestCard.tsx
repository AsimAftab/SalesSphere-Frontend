import React from 'react';
import { motion } from 'framer-motion';
import { TagIcon } from '@heroicons/react/24/outline';

interface SiteInterestCardProps {
    siteInterest: any[] | undefined;
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

const SiteInterestCard: React.FC<SiteInterestCardProps> = ({ siteInterest }) => {
    return (
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 mt-6 overflow-hidden">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center border border-green-100">
                        <TagIcon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                            Site Interest Categories
                        </h3>
                        <p className="text-sm text-gray-500 hidden sm:block">
                            Categories and brands the site is associated with.
                        </p>
                    </div>
                </div>
                <span className="bg-gray-100 text-gray-700 text-sm font-bold px-3 py-1 rounded-full border border-gray-200">
                    {siteInterest?.length || 0} Categories
                </span>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
                {siteInterest && siteInterest.length > 0 ? (
                    siteInterest.map((item: any, index: number) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -2 }}
                            className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-secondary transition-all duration-200 h-full group"
                        >
                            {/* Category Header with Accent */}
                            <div className="p-4 border-b border-400 bg-gray-50/50 rounded-t-xl">
                                <div className="flex items-center gap-2.5">
                                    <h4 className="font-semibold text-gray-900 text-sm truncate leading-snug uppercase" title={item.category}>
                                        {item.category}
                                    </h4>
                                </div>
                            </div>

                            {/* Brands Body */}
                            <div className="p-4 flex-1 flex flex-col">
                                <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Brands</p>
                                <div className="flex flex-wrap gap-2 content-start">
                                    {item.brands && item.brands.length > 0 ? (
                                        item.brands.map((brand: string, bIndex: number) => (
                                            <span
                                                key={bIndex}
                                                className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-blue-50 text-secondary border border-blue-100 hover:bg-blue-100 transition-colors duration-150 cursor-default"
                                            >
                                                {brand}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-400 italic flex items-center gap-1">No brands specified</span>
                                    )}
                                </div>

                                {/* Display Technicians for the Site Interest (If available) */}
                                {item.technicians && item.technicians.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-dashed border-gray-200">
                                        <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-2">Technicians</p>
                                        <div className="space-y-1">
                                            {item.technicians.map((tech: any, tIndex: number) => (
                                                <div key={tIndex} className="flex items-center text-sm text-gray-700 bg-gray-100 p-1 rounded uppercase">
                                                    <span className="truncate" title={tech.name}>{tech.name}</span>
                                                    <span className="ml-auto text-gray-500 flex-shrink-0">{tech.phone}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                            <TagIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-medium text-gray-900">No Interests Found</h4>
                        <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">This site hasn't defined any specific categories or brands yet.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SiteInterestCard;
