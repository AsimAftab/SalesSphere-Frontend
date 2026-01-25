import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CustomButton from "../../UI/Button/Button";
import DropDown from "../../UI/DropDown/DropDown";
import { CheckCircle2 } from "lucide-react";

// Import icons from assets
import dashboardIcon from '../../../assets/Image/icons/dashboard-icon.svg';
import trackingIcon from '../../../assets/Image/icons/tracking-icon.svg';
import productsIcon from '../../../assets/Image/icons/products-icon.svg';
import ordersIcon from '../../../assets/Image/icons/orders-icon.svg';
import employeesIcon from '../../../assets/Image/icons/employees-icon.svg';
import attendanceIcon from '../../../assets/Image/icons/attendance-icon.svg';
import leavesIcon from '../../../assets/Image/icons/leaves-icon.svg';
import partiesIcon from '../../../assets/Image/icons/parties-icon.svg';
import prospectsIcon from '../../../assets/Image/icons/prospects-icon.svg';
import sitesIcon from '../../../assets/Image/icons/sites-icon.svg';
import analyticsIcon from '../../../assets/Image/icons/analytics-icon.svg';
import beatPlanIcon from '../../../assets/Image/icons/beat-plan-icon.svg';
import tourPlanIcon from '../../../assets/Image/icons/TourPlanIcon.svg';
import collectionIcon from '../../../assets/Image/icons/collection.svg';
import expensesIcon from '../../../assets/Image/icons/expensesIcon.svg';
import OdometerIcon from '../../../assets/Image/icons/Odometer.svg';
import NotesIcon from '../../../assets/Image/icons/NotesIcon.svg';
import miscellaneousWorkIcon from '../../../assets/Image/icons/miscellaneousWorkIcon.svg';

interface CustomPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (plan: CustomPlanData) => void;
    initialPlan?: CustomPlanData | null; // Optional prop for editing
}

export interface CustomPlanData {
    name: string;
    enabledModules: string[];
    maxEmployees: number;
    price: {
        amount: number;
        currency: string;
        billingCycle: string;
    };
}

// Available modules for selection with icons
const AVAILABLE_MODULES = [
    { id: 'dashboard', label: 'Dashboard', icon: dashboardIcon },
    { id: 'live_tracking', label: 'Live Tracking', icon: trackingIcon },
    { id: 'products', label: 'Products', icon: productsIcon },
    { id: 'order_lists', label: 'Order Lists', icon: ordersIcon },
    { id: 'employees', label: 'Employees', icon: employeesIcon },
    { id: 'attendance', label: 'Attendance', icon: attendanceIcon },
    { id: 'leaves', label: 'Leaves', icon: leavesIcon },
    { id: 'parties', label: 'Parties', icon: partiesIcon },
    { id: 'prospects', label: 'Prospects', icon: prospectsIcon },
    { id: 'sites', label: 'Sites', icon: sitesIcon },
    { id: 'analytics', label: 'Analytics', icon: analyticsIcon },
    { id: 'beat_plan', label: 'Beat Plan', icon: beatPlanIcon },
    { id: 'tour_plan', label: 'Tour Plan', icon: tourPlanIcon },
    { id: 'collections', label: 'Collections', icon: collectionIcon },
    { id: 'expenses', label: 'Expenses', icon: expensesIcon },
    { id: 'odometer', label: 'Odometer', icon: OdometerIcon },
    { id: 'notes', label: 'Notes', icon: NotesIcon },
    { id: 'miscellaneous_work', label: 'Miscellaneous Work', icon: miscellaneousWorkIcon },
];

export function CustomPlanModal({ isOpen, onClose, onSubmit, initialPlan }: CustomPlanModalProps) {
    const [formData, setFormData] = useState<CustomPlanData>(initialPlan || {
        name: "",
        enabledModules: [],
        maxEmployees: 10,
        price: {
            amount: 0,
            currency: "INR",
            billingCycle: "yearly"
        }
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(initialPlan || {
                name: "",
                enabledModules: [],
                maxEmployees: 10,
                price: {
                    amount: 0,
                    currency: "INR",
                    billingCycle: "yearly"
                }
            });
        }
    }, [isOpen, initialPlan]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle price fields
        if (name.startsWith('price.')) {
            const priceField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                price: {
                    ...prev.price,
                    [priceField]: priceField === 'amount' ? Number(value) : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'maxEmployees' ? Number(value) : value
            }));
        }

        // Clear errors
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleModuleToggle = (moduleId: string) => {
        setFormData(prev => {
            const currentModules = prev.enabledModules;
            const isEnabled = currentModules.includes(moduleId);

            let newModules;
            if (isEnabled) {
                newModules = currentModules.filter(id => id !== moduleId);
            } else {
                newModules = [...currentModules, moduleId];
            }

            return {
                ...prev,
                enabledModules: newModules
            };
        });
    };

    const handleSelectAll = () => {
        setFormData(prev => ({
            ...prev,
            enabledModules: AVAILABLE_MODULES.map(m => m.id)
        }));
    };

    const handleDeselectAll = () => {
        setFormData(prev => ({
            ...prev,
            enabledModules: []
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Plan name is required";
        }

        if (formData.maxEmployees <= 0) {
            newErrors.maxEmployees = "Max employees must be greater than 0";
        }

        if (formData.price.amount < 0) {
            newErrors.amount = "Amount cannot be negative";
        }

        if (formData.enabledModules.length === 0) {
            newErrors.modules = "Please select at least one module";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call delay
        setTimeout(() => {
            onSubmit(formData);
            setIsSubmitting(false);
            handleClose();
        }, 500);
    };

    const handleClose = () => {
        // Reset form
        setFormData({
            name: "",
            enabledModules: [],
            maxEmployees: 10,
            price: {
                amount: 0,
                currency: "INR",
                billingCycle: "yearly"
            }
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]"
            onClick={handleClose}
        >
            <div
                className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden z-[10000] shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Create Custom Plan</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Configure tailored plan details</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:rotate-90 focus:outline-none"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">
                        <div className="p-6 space-y-6">
                            {/* Plan Details Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Plan Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors text-sm ${errors.name ? 'border-red-500' : 'border-gray-200'}`}
                                        placeholder="e.g. Enterprise Plan"
                                    />
                                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Max Employees <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="maxEmployees"
                                        value={formData.maxEmployees}
                                        onChange={handleChange}
                                        min="1"
                                        className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors text-sm ${errors.maxEmployees ? 'border-red-500' : 'border-gray-200'}`}
                                    />
                                    {errors.maxEmployees && <p className="mt-1 text-xs text-red-500">{errors.maxEmployees}</p>}
                                </div>
                            </div>

                            {/* Pricing Row */}
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Amount <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="price.amount"
                                            value={formData.price.amount}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="0"
                                            className={`w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors text-sm ${errors.amount ? 'border-red-500' : 'border-gray-200'}`}
                                        />
                                    </div>
                                    {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Currency <span className="text-red-500">*</span>
                                    </label>
                                    <DropDown
                                        value={formData.price.currency}
                                        onChange={(value) => handleChange({ target: { name: 'price.currency', value } } as any)}
                                        options={[
                                            { value: 'INR', label: 'INR (₹)' },
                                            { value: 'USD', label: 'USD ($)' },
                                            { value: 'EUR', label: 'EUR (€)' }
                                        ]}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Billing Cycle <span className="text-red-500">*</span>
                                    </label>
                                    <DropDown
                                        value={formData.price.billingCycle}
                                        onChange={(value) => handleChange({ target: { name: 'price.billingCycle', value } } as any)}
                                        options={[
                                            { value: 'monthly', label: 'Monthly' },
                                            { value: 'yearly', label: 'Yearly' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-100"></div>

                            {/* Modules Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                            Modules
                                        </h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-secondary/10 text-secondary transition-colors"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeselectAll}
                                            className="text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    </div>
                                </div>

                                {errors.modules && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    {errors.modules}
                                </div>}

                                <div className="grid grid-cols-4 gap-3">
                                    {AVAILABLE_MODULES.map((module) => {
                                        const isSelected = formData.enabledModules.includes(module.id);

                                        return (
                                            <div
                                                key={module.id}
                                                onClick={() => handleModuleToggle(module.id)}
                                                className={`
                                                    relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all duration-200 group h-24
                                                    ${isSelected
                                                        ? 'border-secondary bg-secondary/5 shadow-sm ring-1 ring-secondary'
                                                        : 'border-gray-300 bg-white hover:border-secondary/50 hover:shadow-md'}
                                                `}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 text-secondary animate-in fade-in zoom-in duration-200">
                                                        <CheckCircle2 className="w-4 h-4 fill-secondary text-white" />
                                                    </div>
                                                )}

                                                <div className={`
                                                    w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-colors duration-200
                                                    ${isSelected ? 'bg-secondary/10 text-secondary' : 'bg-gray-50 text-gray-500 group-hover:bg-secondary/5 group-hover:text-secondary'}
                                                `}>
                                                    <img
                                                        src={module.icon}
                                                        alt={module.label}
                                                        className={`w-5 h-5 ${isSelected ? '' : 'opacity-60 group-hover:opacity-100'}`}
                                                    />
                                                </div>
                                                <span className={`text-xs font-medium text-center leading-tight ${isSelected ? 'text-secondary font-semibold' : 'text-gray-600'}`}>
                                                    {module.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
                            <CustomButton
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="text-gray-700 bg-white border-gray-300 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </CustomButton>
                            <CustomButton
                                type="submit"
                                variant="secondary"
                                disabled={isSubmitting}
                                className="shadow-lg shadow-secondary/20"
                            >
                                {isSubmitting ? "Creating..." : "Create Plan"}
                            </CustomButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
