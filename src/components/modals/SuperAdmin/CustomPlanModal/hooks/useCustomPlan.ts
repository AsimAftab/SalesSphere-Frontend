import { useState, useEffect } from 'react';
import type { PlanFormData, ChangeEvent } from '../types';
import type { SubscriptionPlan } from '@/api/SuperAdmin';
import type { FeatureRegistry } from '@/api/roleService';
import type { EnrichedModule } from '@/components/modals/SuperAdmin/CustomPlanModal/types';

interface UseCustomPlanProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (plan: Partial<SubscriptionPlan>) => void | Promise<void>;
    initialPlan?: SubscriptionPlan | null;
    availableModules?: EnrichedModule[];
    featureRegistry?: FeatureRegistry;
}

export const useCustomPlan = ({
    isOpen,
    onClose,
    onSubmit,
    initialPlan,
    availableModules = [],
    featureRegistry = {}
}: UseCustomPlanProps) => {
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
                tier: initialPlan.tier,
                moduleFeatures: initialPlan.moduleFeatures || {}
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

            // If we are enabling a module, we should also initialize its features
            // If disabling, we might want to clear them or keep them (keeping them is safer for re-enabling)

            if (isEnabled) {
                newModules = currentModules.filter(id => id !== moduleId);
            } else {
                newModules = [...currentModules, moduleId];
            }

            // If enabling, auto-select all features for convenience (user can deselect)
            let newModuleFeatures = { ...prev.moduleFeatures };
            if (!isEnabled && featureRegistry[moduleId]) {
                const defaultFeatures: Record<string, boolean> = {};
                Object.keys(featureRegistry[moduleId]).forEach(key => {
                    defaultFeatures[key] = true;
                });
                newModuleFeatures = {
                    ...newModuleFeatures,
                    [moduleId]: defaultFeatures
                };
            }

            return {
                ...prev,
                enabledModules: newModules,
                moduleFeatures: newModuleFeatures
            };
        });
    };

    const handleFeatureToggle = (moduleId: string, featureKey: string) => {
        setFormData((prev: PlanFormData) => {
            const currentModuleFeatures = prev.moduleFeatures?.[moduleId] || {};
            const isFeatureEnabled = !!currentModuleFeatures[featureKey];

            return {
                ...prev,
                moduleFeatures: {
                    ...prev.moduleFeatures,
                    [moduleId]: {
                        ...currentModuleFeatures,
                        [featureKey]: !isFeatureEnabled
                    }
                }
            };
        });
    };

    const handleSelectAll = () => {
        const allModuleIds = availableModules.map(m => m.key);
        const newModuleFeatures: Record<string, Record<string, boolean>> = {};

        allModuleIds.forEach(moduleId => {
            const features = featureRegistry[moduleId];
            if (features) {
                newModuleFeatures[moduleId] = {};
                Object.keys(features).forEach(featureKey => {
                    newModuleFeatures[moduleId][featureKey] = true;
                });
            }
        });

        setFormData((prev: PlanFormData) => ({
            ...prev,
            enabledModules: allModuleIds,
            moduleFeatures: newModuleFeatures
        }));
    };

    const handleDeselectAll = () => {
        setFormData((prev: PlanFormData) => ({
            ...prev,
            enabledModules: [],
            moduleFeatures: {} // Clear features as well for a clean state
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
            // Construct moduleFeatures payload: Auto-enable ALL features for selected modules
            const moduleFeaturesPayload: Record<string, Record<string, boolean>> = {};

            formData.enabledModules.forEach(moduleId => {
                const moduleFeatures = featureRegistry[moduleId];
                if (moduleFeatures) {
                    moduleFeaturesPayload[moduleId] = {};
                    Object.keys(moduleFeatures).forEach(featureKey => {
                        moduleFeaturesPayload[moduleId][featureKey] = true;
                    });
                }
            });

            // Ensure settings is always included
            const finalEnabledModules = formData.enabledModules.includes('settings')
                ? formData.enabledModules
                : [...formData.enabledModules, 'settings'];

            // Add settings features if available
            if (featureRegistry['settings']) {
                moduleFeaturesPayload['settings'] = {};
                Object.keys(featureRegistry['settings']).forEach(key => {
                    moduleFeaturesPayload['settings'][key] = true;
                });
            }

            const submitData = {
                ...formData,
                isActive: true, // Explicitly set active
                enabledModules: finalEnabledModules,
                moduleFeatures: moduleFeaturesPayload
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
        availableModules,
        handleChange,
        handleModuleToggle,
        handleSelectAll,
        handleDeselectAll,
        handleSubmit,
        handleClose,
        featureRegistry,
        handleFeatureToggle
    };
};
