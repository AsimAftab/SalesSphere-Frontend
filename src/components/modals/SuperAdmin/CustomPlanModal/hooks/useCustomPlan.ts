import { useState, useEffect } from 'react';
import type { PlanFormData, ChangeEvent } from '../types';
import type { SubscriptionPlan } from '@/api/SuperAdmin';
import { AVAILABLE_MODULES } from '../constants';

interface UseCustomPlanProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (plan: Partial<SubscriptionPlan>) => void | Promise<void>;
    initialPlan?: SubscriptionPlan | null;
}

export const useCustomPlan = ({ isOpen, onClose, onSubmit, initialPlan }: UseCustomPlanProps) => {
    const [formData, setFormData] = useState<PlanFormData>({
        name: "",
        description: "",
        enabledModules: [],
        maxEmployees: 0,
        price: {
            amount: 0,
            currency: "",
            billingCycle: ""
        },
        tier: 'custom'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialPlan ? {
                name: initialPlan.name,
                description: initialPlan.description,
                enabledModules: initialPlan.enabledModules,
                maxEmployees: initialPlan.maxEmployees,
                price: initialPlan.price,
                tier: initialPlan.tier
            } : {
                name: "",
                description: "",
                enabledModules: [],
                maxEmployees: 0,
                price: {
                    amount: 0,
                    currency: "",
                    billingCycle: ""
                },
                tier: 'custom'
            });
            setErrors({});
        }
    }, [isOpen, initialPlan]);

    const handleChange = (e: ChangeEvent) => {
        const { name, value } = e.target;

        if (name.startsWith('price.')) {
            const priceField = name.split('.')[1];
            setFormData((prev: PlanFormData) => ({
                ...prev,
                price: {
                    ...prev.price,
                    [priceField]: priceField === 'amount' ? Number(value) : value
                }
            }));
        } else {
            setFormData((prev: PlanFormData) => ({
                ...prev,
                [name]: name === 'maxEmployees' ? Number(value) : value
            }));
        }

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleModuleToggle = (moduleId: string) => {
        setFormData((prev: PlanFormData) => {
            const currentModules = prev.enabledModules;
            const isEnabled = currentModules.includes(moduleId);
            let newModules;
            if (isEnabled) {
                newModules = currentModules.filter(id => id !== moduleId);
            } else {
                newModules = [...currentModules, moduleId];
            }
            return { ...prev, enabledModules: newModules };
        });
    };

    const handleSelectAll = () => {
        setFormData((prev: PlanFormData) => ({
            ...prev,
            enabledModules: AVAILABLE_MODULES.map(m => m.id)
        }));
    };

    const handleDeselectAll = () => {
        setFormData((prev: PlanFormData) => ({
            ...prev,
            enabledModules: []
        }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "Plan name is required";
        if (formData.maxEmployees <= 0) newErrors.maxEmployees = "Max employees must be greater than 0";
        if (formData.price.amount <= 0) newErrors.amount = "Amount must be greater than 0";
        if (!formData.price.currency) newErrors.currency = "Currency is required";
        if (!formData.price.billingCycle) newErrors.billingCycle = "Billing cycle is required";
        if (formData.enabledModules.length === 0) newErrors.modules = "Please select at least one module";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            const submitData = {
                ...formData,
                enabledModules: formData.enabledModules.includes('settings')
                    ? formData.enabledModules
                    : [...formData.enabledModules, 'settings']
            };
            await onSubmit(submitData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            description: "",
            enabledModules: [],
            maxEmployees: 0,
            price: { amount: 0, currency: "", billingCycle: "" },
            tier: 'custom'
        });
        setErrors({});
        onClose();
    };

    return {
        formData,
        errors,
        isSubmitting,
        handleChange,
        handleModuleToggle,
        handleSelectAll,
        handleDeselectAll,
        handleSubmit,
        handleClose
    };
};
