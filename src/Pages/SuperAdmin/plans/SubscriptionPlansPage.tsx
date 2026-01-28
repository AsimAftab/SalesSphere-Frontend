import { useState, useEffect } from 'react';
import {
    CheckIcon,
    PlusIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import subscriptionPlanService from '../../../api/SuperAdmin/subscriptionPlanService';
import type { SubscriptionPlan } from '../../../api/SuperAdmin/subscriptionPlanService';
import { Button } from '../../../components/UI/SuperadminComponents/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../../components/UI/SuperadminComponents/card';
import { Badge } from '../../../components/UI/SuperadminComponents/badge';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { CustomPlanModal } from '../../../components/modals/superadmin/CustomPlanModal';

export default function SubscriptionPlansPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCustomPlanModalOpen, setIsCustomPlanModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            const response = await subscriptionPlanService.getAll();
            setPlans(response.data.data || []);
        } catch (error) {
            console.error("Error fetching plans:", error);
            toast.error("Failed to load subscription plans");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePlan = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this plan? This action cannot be undone.")) return;
        try {
            await subscriptionPlanService.delete(id);
            toast.success("Plan deleted successfully");
            fetchPlans();
        } catch (error) {
            toast.error("Failed to delete plan");
        }
    };

    const handleEditPlan = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setIsCustomPlanModalOpen(true);
    };

    const handleCreatePlan = () => {
        setSelectedPlan(null);
        setIsCustomPlanModalOpen(true);
    };

    const handleSavePlan = async (planData: Partial<SubscriptionPlan>) => {
        // Close modal immediately or handle loading state if modal supported it
        // Since modal closes immediately in current hook implementation:
        try {
            if (selectedPlan && selectedPlan._id) {
                await subscriptionPlanService.update(selectedPlan._id, planData);
                toast.success("Plan updated successfully");
            } else {
                // Cast to any or helper if create expects fewer fields than SubscriptionPlan
                await subscriptionPlanService.create(planData as any);
                toast.success("Plan created successfully");
            }
            fetchPlans();
        } catch (error) {
            console.error("Error saving plan:", error);
            toast.error("Failed to save plan");
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Subscription Plans</h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Configure pricing tiers and feature entitlements for organizations.
                    </p>
                </div>
                <Button onClick={handleCreatePlan} className="w-full sm:w-auto">
                    <PlusIcon className="mr-2 h-4 w-4" /> Create Custom Plan
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {plans.map((plan) => (
                    <Card key={plan._id} className="flex flex-col relative overflow-hidden transition-all hover:shadow-lg border-t-4 border-t-primary">
                        {plan.tier === 'custom' && (
                            <div className="absolute top-0 right-0">
                                <Badge variant="secondary" className="rounded-none rounded-bl-lg">Custom</Badge>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center text-xl">
                                {plan.name}
                            </CardTitle>
                            <CardDescription className="text-2xl font-bold text-primary mt-2">
                                {plan.price.currency} {plan.price.amount}
                                <span className="text-sm font-normal text-muted-foreground">/{plan.price.billingCycle}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-gray-900">Includes:</p>
                                <ul className="space-y-2">
                                    <li className="flex items-center text-sm text-gray-600">
                                        <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                                        {plan.maxEmployees} Users Limit
                                    </li>
                                    {plan.enabledModules?.slice(0, 5).map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-gray-600">
                                            <CheckIcon className="mr-2 h-4 w-4 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                    {plan.enabledModules && plan.enabledModules.length > 5 && (
                                        <li className="text-xs text-muted-foreground pl-6">
                                            +{plan.enabledModules.length - 5} more features
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t bg-gray-50/50 p-4">
                            <Button variant="ghost" size="sm" onClick={() => handleEditPlan(plan)}>
                                <PencilSquareIcon className="mr-2 h-4 w-4" /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeletePlan(plan._id)}>
                                <TrashIcon className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <CustomPlanModal
                isOpen={isCustomPlanModalOpen}
                onClose={() => setIsCustomPlanModalOpen(false)}
                onSubmit={handleSavePlan}
                initialPlan={selectedPlan}
            />
        </div>
    );
}
