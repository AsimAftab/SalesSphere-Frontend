import React from 'react';
import { AlertCircle, FileText } from 'lucide-react';
import type { PlanFormData, ChangeHandler } from '../types';

interface PlanDetailsSectionProps {
    formData: PlanFormData;
    errors: Record<string, string>;
    handleChange: ChangeHandler;
}

const PlanDetailsSection: React.FC<PlanDetailsSectionProps> = ({ formData, errors, handleChange }) => {
    const renderError = (key: string) => {
        if (!errors[key]) return null;
        return (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors[key]}
            </p>
        );
    };

    const inputClass = (hasError: boolean) =>
        `w-full px-4 py-2.5 border rounded-xl outline-none transition-all ${
            hasError
                ? 'border-red-500 ring-1 ring-red-100'
                : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        }`;

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="plan-name-input" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Plan Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="plan-name-input"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass(!!errors.name)}
                    placeholder="e.g. Enterprise Plan"
                />
                {renderError('name')}
            </div>

            <div>
                <label htmlFor="plan-description-input" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    Description
                </label>
                <textarea
                    id="plan-description-input"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleChange({ target: { name: 'description', value: e.target.value } })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Brief description of this plan..."
                />
            </div>
        </div>
    );
};

export default PlanDetailsSection;
