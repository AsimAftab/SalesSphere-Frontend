import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tourPlanSchema, type TourPlanFormData } from '../common/TourPlanSchema';
import { type TourPlan, type CreateTourRequest } from '@/api/tourPlanService';

interface UseTourPlanEntityProps {
    isOpen: boolean;
    initialData?: TourPlan | null;
    onSave: (formData: CreateTourRequest) => Promise<void>;
}

export const useTourPlanEntity = ({ isOpen, initialData, onSave }: UseTourPlanEntityProps) => {
    const form = useForm<TourPlanFormData>({
        resolver: zodResolver(tourPlanSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            placeOfVisit: '',
            purposeOfVisit: '',
            startDate: undefined,
            endDate: undefined,
        }
    });

    const { reset } = form;

    // Reset / populate form when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    placeOfVisit: initialData.placeOfVisit || '',
                    purposeOfVisit: initialData.purposeOfVisit || '',
                    startDate: initialData.startDate ? new Date(initialData.startDate) : undefined,
                    endDate: initialData.endDate ? new Date(initialData.endDate) : undefined,
                });
            } else {
                reset({
                    placeOfVisit: '',
                    purposeOfVisit: '',
                    startDate: undefined,
                    endDate: undefined,
                });
            }
        }
    }, [isOpen, initialData, reset]);

    const handleSubmit = useCallback(async (data: TourPlanFormData) => {
        const normalizeDate = (d: Date | null | undefined): string | undefined => {
            if (!d) return undefined;
            const copy = new Date(d);
            copy.setHours(12, 0, 0, 0);
            return copy.toISOString();
        };

        const startDate = normalizeDate(data.startDate) || '';
        // If endDate is omitted or invalid, default to startDate (single day tour)
        // Backend requires a valid ISO string for endDate
        const endDate = normalizeDate(data.endDate) || startDate;

        await onSave({
            placeOfVisit: data.placeOfVisit,
            purposeOfVisit: data.purposeOfVisit,
            startDate,
            endDate,
        });
    }, [onSave]);

    return {
        form,
        onSubmit: form.handleSubmit(handleSubmit),
        reset,
    };
};
