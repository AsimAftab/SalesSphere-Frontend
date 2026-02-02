import React from 'react';
import type { SubscriptionPlan } from "@/api/SuperAdmin/subscriptionPlanService";

export interface CustomPlanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (plan: Partial<SubscriptionPlan>) => void;
    onSuccess?: () => void;
    initialPlan?: SubscriptionPlan | null;
}

export type PlanFormData = Omit<SubscriptionPlan, '_id' | 'isSystemPlan' | 'isActive' | 'organizationId' | 'tier'> & {
    tier?: 'basic' | 'standard' | 'premium' | 'custom';
};

export type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | number | boolean } };

export type ChangeHandler = (e: ChangeEvent) => void;
