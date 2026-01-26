import React from 'react';
import type { PlanFormData, ChangeHandler } from '../types';

interface PlanDetailsSectionProps {
    formData: PlanFormData;
    errors: Record<string, string>;
    handleChange: ChangeHandler;
}

const PlanDetailsSection: React.FC<PlanDetailsSectionProps> = ({ formData, errors, handleChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors">
                    Plan Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm bg-gray-50/50 hover:bg-white ${errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                        placeholder="e.g. Enterprise Plan"
                    />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500 font-medium animate-pulse">{errors.name}</p>}
            </div>

            <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors">
                    Max Employees <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                    <input
                        type="number"
                        name="maxEmployees"
                        value={formData.maxEmployees}
                        onChange={handleChange}
                        min="1"
                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm bg-gray-50/50 hover:bg-white ${errors.maxEmployees ? 'border-red-500 focus:ring-red-200' : 'border-gray-200'}`}
                        placeholder="100"
                    />
                </div>
                {errors.maxEmployees && <p className="mt-1 text-xs text-red-500 font-medium animate-pulse">{errors.maxEmployees}</p>}
            </div>
        </div>
    );
};

export default PlanDetailsSection;
