import React from 'react';
import { motion } from 'framer-motion';
import { TagIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';
import type { SiteInterestItem, Technician } from '@/api/siteService';

interface SiteInterestCardProps {
    siteInterest: SiteInterestItem[] | undefined;
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
                    {siteInterest?.length || 0} {(siteInterest?.length || 0) === 1 ? 'Category' : 'Categories'}
                </span>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 items-stretch">
                {siteInterest && siteInterest.length > 0 ? (
                    siteInterest.map((item: SiteInterestItem, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -2 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all duration-200 h-full group"
                        >
                            {/* Category Header */}
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
                                <h4 className="font-semibold text-gray-900 text-sm truncate leading-snug uppercase" title={item.category}>
                                    {item.category}
                                </h4>
                            </div>

                            {/* Brands */}
                            <div className="p-4 flex-1 flex flex-col">
                                <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Brands</p>
                                <div className="flex flex-wrap gap-2 content-start">
                                    {item.brands && item.brands.length > 0 ? (
                                        item.brands.map((brand: string, bIndex: number) => (
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

                                {/* Site Contacts */}
                                {item.technicians && item.technicians.length > 0 && (
                                    <div className="mt-auto pt-4">
                                        <div className="border-t border-gray-100 pt-3">
                                            <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Site Contacts</p>
                                            <div className="space-y-2">
                                                {item.technicians.map((tech: Technician, tIndex: number) => (
                                                    <div
                                                        key={tIndex}
                                                        className="p-2.5 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5" title={tech.name}>
                                                            <UserIcon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                                                            <span className="break-all">{tech.name}</span>
                                                        </p>
                                                        {tech.phone && (
                                                            <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                                                <PhoneIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                                                <span className="break-all">{tech.phone}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-6 text-center">
                        <h4 className="text-base font-semibold text-gray-800">No Interest Categories</h4>
                        <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                            This site hasn't been associated with any interest categories or brands yet.
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default SiteInterestCard;
