import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tourPlanSchema, type TourPlanFormData } from '../common/TourPlanSchema';
import { type TourPlan, type CreateTourRequest } from '../../../../api/tourPlanService';

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
            startDate: undefined as unknown as Date,
            endDate: undefined as unknown as Date,
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
                    startDate: initialData.startDate ? new Date(initialData.startDate) : undefined as unknown as Date,
                    endDate: initialData.endDate ? new Date(initialData.endDate) : undefined as unknown as Date,
                });
            } else {
                reset({
                    placeOfVisit: '',
                    purposeOfVisit: '',
                    startDate: undefined as unknown as Date,
                    endDate: undefined as unknown as Date,
                });
            }
        }
    }, [isOpen, initialData, reset]);

    const handleSubmit = useCallback(async (data: TourPlanFormData) => {
        const normalizeDate = (d: Date | null | undefined): string => {
            if (!d) return '';
            const copy = new Date(d);
            copy.setHours(12, 0, 0, 0);
            return copy.toISOString();
        };

        await onSave({
            placeOfVisit: data.placeOfVisit,
            purposeOfVisit: data.purposeOfVisit,
            startDate: normalizeDate(data.startDate),
            endDate: normalizeDate(data.endDate),
        });
    }, [onSave]);

    return {
        form,
        onSubmit: form.handleSubmit(handleSubmit),
        reset,
    };
};
